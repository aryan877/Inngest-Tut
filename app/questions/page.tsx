"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { QuestionWithAuthor } from "@/lib/api";
import { useQuestions } from "@/lib/queries";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function QuestionsPage() {
  const { data, isLoading, error } = useQuestions(1);

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error loading questions</div>;
  }

  const questions: QuestionWithAuthor[] = data?.data?.questions || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            All Questions
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {data?.data?.pagination?.total || 0} questions
          </p>
        </div>
        <Link href="/questions/ask">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            Ask Question
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-card border border-border rounded p-6 hover:shadow-sm transition-shadow"
          >
            <Link href={`/questions/${question.id}`}>
              <h2 className="text-xl font-semibold mb-2 text-card-foreground hover:text-muted-foreground transition-colors">
                {question.title}
              </h2>
            </Link>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {question.body.substring(0, 200)}...
            </p>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm flex-wrap gap-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="font-medium">{question.votes} votes</span>
                <span>{question.views} views</span>
                {question.aiAnswerGenerated && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs"
                  >
                    AI Answer
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  asked {formatDistanceToNow(new Date(question.createdAt))} ago
                </span>
                <span className="font-medium text-foreground">
                  {question.author?.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No questions yet. Be the first to ask!
          </p>
        </div>
      )}
    </div>
  );
}
