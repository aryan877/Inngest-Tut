"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Question {
  id: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
  votes: number;
  aiAnswerGenerated: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}

async function fetchQuestions(page: number = 1) {
  const res = await fetch(`/api/questions?page=${page}&limit=20`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export default function QuestionsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["questions", 1],
    queryFn: () => fetchQuestions(1),
  });

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error loading questions</div>;
  }

  const questions: Question[] = data?.data?.questions || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-zinc-800 dark:text-white">
            All Questions
          </h1>
          <p className="text-sm text-zinc-700 dark:text-zinc-400 mt-2">
            {data?.data?.pagination?.total || 0} questions
          </p>
        </div>
        <Link href="/questions/ask">
          <Button className="bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-950 dark:hover:bg-white text-zinc-50 dark:text-zinc-800 font-semibold">
            Ask Question
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-6 hover:shadow-sm transition-shadow"
          >
            <Link href={`/questions/${question.id}`}>
              <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                {question.title}
              </h2>
            </Link>

            <p className="text-sm text-zinc-700 dark:text-zinc-400 line-clamp-2 mb-4">
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
              <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
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
                <span className="text-zinc-500 dark:text-zinc-400">
                  asked {formatDistanceToNow(new Date(question.createdAt))} ago
                </span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {question.author?.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-700 dark:text-zinc-400">
            No questions yet. Be the first to ask!
          </p>
        </div>
      )}
    </div>
  );
}
