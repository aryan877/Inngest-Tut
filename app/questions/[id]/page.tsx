"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoteButtons } from "@/components/vote-buttons";
import {
  submitAnswerSchema,
  type SubmitAnswerFormData,
} from "@/lib/validations/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Answer {
  id: number;
  content: string;
  isAiGenerated: boolean;
  votes: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  } | null;
}

interface Question {
  id: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
  votes: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  answers: Answer[];
}

async function fetchQuestion(id: string) {
  const res = await fetch(`/api/questions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch question");
  return res.json();
}

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.id as string;
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => fetchQuestion(questionId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubmitAnswerFormData>({
    resolver: zodResolver(submitAnswerSchema),
    defaultValues: {
      content: "",
      images: [],
    },
  });

  const onSubmitAnswer = async (formData: SubmitAnswerFormData) => {
    setSubmitError("");

    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: formData.content,
          images: formData.images,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit answer");
      }

      // Reset form and refresh question data
      reset();
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    } catch (err: any) {
      setSubmitError(
        err.message || "Failed to submit answer. Please try again."
      );
    }
  };

  if (isLoading) {
    return <div>Loading question...</div>;
  }

  if (error) {
    return <div>Error loading question</div>;
  }

  const question: Question = data?.data;

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Question */}
      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-6 mb-6">
        <div className="flex gap-4">
          <VoteButtons
            itemId={question.id}
            itemType="question"
            initialVotes={question.votes}
          />

          <div className="flex-1">
            <h1 className="font-heading text-3xl font-bold mb-4 text-zinc-800 dark:text-white">
              {question.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              <span>
                Asked {formatDistanceToNow(new Date(question.createdAt))} ago
              </span>
              <span>{question.views} views</span>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none mb-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md my-4"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {question.body}
              </ReactMarkdown>
            </div>

            <div className="flex items-center gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Asked by
                </span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {question.author.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold mb-4 text-zinc-800 dark:text-white">
          {question.answers.length} Answer
          {question.answers.length !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-4">
          {question.answers.map((answer) => (
            <div
              key={answer.id}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-6"
            >
              <div className="flex gap-4">
                <VoteButtons
                  itemId={answer.id}
                  itemType="answer"
                  initialVotes={answer.votes}
                />

                <div className="flex-1">
                  {answer.isAiGenerated && (
                    <div className="mb-4">
                      <Badge
                        variant="outline"
                        className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                      >
                        AI-Generated Answer
                      </Badge>
                    </div>
                  )}

                  <div className="prose prose-zinc dark:prose-invert max-w-none mb-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-md my-4"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code
                              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {answer.content}
                    </ReactMarkdown>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        Answered{" "}
                        {formatDistanceToNow(new Date(answer.createdAt))} ago
                      </span>
                      {answer.author && (
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {answer.author.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Answer Form */}
      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-6">
        <h3 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-white">
          Your Answer
        </h3>

        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-4 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitAnswer)}>
          <div className="mb-4">
            <Label htmlFor="content">
              Answer<span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Write your answer here... (Markdown supported)"
              className="mt-2 min-h-[200px]"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-950 dark:hover:bg-white text-zinc-50 dark:text-zinc-800 font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        </form>
      </div>
    </div>
  );
}
