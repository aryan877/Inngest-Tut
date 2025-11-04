import { requireAuth } from "@/lib/auth-middleware";
import { db } from "@/lib/db";
import { questions, questionVotes, userProfile } from "@/lib/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// POST /api/questions/[id]/vote - Vote on a question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) return authResult.error;

    const { userId } = authResult;

    const { id } = await params;
    const questionId = parseInt(id);
    const { voteType } = await request.json();

    if (!voteType || !["upvote", "downvote"].includes(voteType)) {
      return NextResponse.json(
        { success: false, error: "Invalid vote type" },
        { status: 400 }
      );
    }

    // Check if user already voted
    const existingVote = await db.query.questionVotes.findFirst({
      where: and(
        eq(questionVotes.questionId, questionId),
        eq(questionVotes.userId, userId)
      ),
    });

    // Get the question to know the author
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, questionId),
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    // Prevent voting on own question
    if (question.authorId === userId) {
      return NextResponse.json(
        { success: false, error: "Cannot vote on your own question" },
        { status: 400 }
      );
    }

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.voteType === voteType) {
        await db
          .delete(questionVotes)
          .where(
            and(
              eq(questionVotes.questionId, questionId),
              eq(questionVotes.userId, userId)
            )
          );

        // Update question votes count atomically
        const voteChange = voteType === "upvote" ? -1 : 1;
        await db
          .update(questions)
          .set({ votes: sql`${questions.votes} + ${voteChange}` })
          .where(eq(questions.id, questionId));

        // Update author reputation atomically
        const repChange = voteType === "upvote" ? -5 : 2;
        await db
          .update(userProfile)
          .set({
            reputation: sql`${userProfile.reputation} + ${repChange}`,
          })
          .where(eq(userProfile.userId, question.authorId));
      } else {
        // Change vote type
        await db
          .update(questionVotes)
          .set({ voteType: voteType as "upvote" | "downvote" })
          .where(
            and(
              eq(questionVotes.questionId, questionId),
              eq(questionVotes.userId, userId)
            )
          );

        // Update question votes count atomically
        const voteChange = voteType === "upvote" ? 2 : -2;
        await db
          .update(questions)
          .set({ votes: sql`${questions.votes} + ${voteChange}` })
          .where(eq(questions.id, questionId));

        // Update author reputation atomically
        const repChange = voteType === "upvote" ? 7 : -7;
        await db
          .update(userProfile)
          .set({
            reputation: sql`${userProfile.reputation} + ${repChange}`,
          })
          .where(eq(userProfile.userId, question.authorId));
      }
    } else {
      // New vote
      await db.insert(questionVotes).values({
        questionId,
        userId,
        voteType: voteType as "upvote" | "downvote",
      });

      // Update question votes count atomically
      const voteChange = voteType === "upvote" ? 1 : -1;
      await db
        .update(questions)
        .set({ votes: sql`${questions.votes} + ${voteChange}` })
        .where(eq(questions.id, questionId));

      // Update author reputation atomically
      const repChange = voteType === "upvote" ? 5 : -2;
      await db
        .update(userProfile)
        .set({
          reputation: sql`${userProfile.reputation} + ${repChange}`,
        })
        .where(eq(userProfile.userId, question.authorId));
    }

    return NextResponse.json({
      success: true,
      message: "Vote recorded",
    });
  } catch (error) {
    console.error("Error voting on question:", error);
    return NextResponse.json(
      { success: false, error: "Failed to vote" },
      { status: 500 }
    );
  }
}
