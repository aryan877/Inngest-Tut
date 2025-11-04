import { db } from "@/lib/db";
import { answers, questions } from "@/lib/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/questions/[id] - Get question by ID with answers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questionId = parseInt(id);

    const question = await db.query.questions.findFirst({
      where: and(eq(questions.id, questionId), eq(questions.isDeleted, false)),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        questionTags: {
          with: {
            tag: {
              columns: {
                name: true,
              },
            },
          },
        },
        answers: {
          where: eq(answers.isDeleted, false),
          orderBy: [desc(answers.votes), desc(answers.createdAt)],
          with: {
            author: {
              columns: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await db
      .update(questions)
      .set({ views: question.views + 1 })
      .where(eq(questions.id, questionId));

    // Transform tags to array of strings
    const { questionTags, ...questionData } = question;
    const transformedQuestion = {
      ...questionData,
      tags: questionTags.map((qt) => qt.tag.name),
      views: question.views + 1,
    };

    return NextResponse.json({
      success: true,
      data: transformedQuestion,
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

// PATCH /api/questions/[id] - Update question
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questionId = parseInt(id);
    const body = await request.json();
    const { title, body: questionBody, userId } = body;

    // Verify ownership
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, questionId),
    });

    if (!question || question.authorId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const [updated] = await db
      .update(questions)
      .set({
        title,
        body: questionBody,
        updatedAt: new Date(),
      })
      .where(eq(questions.id, questionId))
      .returning();

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE /api/questions/[id] - Soft delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questionId = parseInt(id);
    const { userId } = await request.json();

    // Verify ownership
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, questionId),
    });

    if (!question || question.authorId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    await db
      .update(questions)
      .set({ isDeleted: true })
      .where(eq(questions.id, questionId));

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
