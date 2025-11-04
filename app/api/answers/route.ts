import { db } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import { answers } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";

// POST /api/answers - Create a new answer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, content, userId } = body;

    if (!questionId || !content || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [newAnswer] = await db
      .insert(answers)
      .values({
        questionId,
        content,
        authorId: userId,
        isAiGenerated: false,
      })
      .returning();

    // Get question details for notification
    const question = await db.query.questions.findFirst({
      where: (questions, { eq }) => eq(questions.id, questionId),
    });

    if (question) {
      // Emit event for notification
      await inngest.send({
        name: "answer.created",
        data: {
          questionId,
          userId: question.authorId,
          answerType: "human",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: newAnswer,
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create answer" },
      { status: 500 }
    );
  }
}
