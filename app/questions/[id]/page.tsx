"use client";

import { ImageDisplay } from "@/components/image-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { VoteButtons } from "@/components/vote-buttons";
import { useCreateAnswer } from "@/lib/mutations";
import { useQuestion } from "@/lib/queries";
import { submitAnswerSchema } from "@/lib/validations/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// Form type used only in this component
interface SubmitAnswerFormData {
  content: string;
  images: string[];
}

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.id as string;
  const [submitError, setSubmitError] = useState("");

  const { data, isLoading, error } = useQuestion(questionId);
  const createAnswerMutation = useCreateAnswer();

  const {
    handleSubmit,
    setValue,
    watch,
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
      await createAnswerMutation.mutateAsync({
        questionId,
        content: formData.content,
        images: formData.images,
      });

      // Reset form on successful submission
      reset();
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

  const question = data?.data;

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Question */}
      <div className="bg-card border border-border rounded p-4 sm:p-6 mb-6">
        <div className="flex flex-col gap-6 md:flex-row md:gap-6">
          <div className="flex justify-center md:block md:pt-1">
            <VoteButtons
              itemId={question.id}
              itemType="question"
              initialVotes={question.votes}
            />
          </div>

          <div className="flex-1">
            <h1 className="font-heading text-3xl font-bold mb-4 text-card-foreground">
              {question.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
              <span>
                Asked {formatDistanceToNow(new Date(question.createdAt))} ago
              </span>
              <span>{question.views} views</span>
            </div>

            <div className="prose prose-brand max-w-none mb-6">
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
                        className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono"
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

            {/* Display question images */}
            <ImageDisplay imageKeys={question.images} />

            <div className="flex items-center gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Asked by</span>
                <span className="font-medium text-foreground">
                  {question.author.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold mb-4 text-card-foreground">
          {question.answers?.length || 0} Answer
          {(question.answers?.length || 0) !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-4">
          {question.answers?.map((answer) => (
            <div
              key={answer.id}
              className="bg-card border border-border rounded p-4 sm:p-6"
            >
              <div className="flex flex-col gap-6 md:flex-row md:gap-6">
                <div className="flex justify-center md:block md:pt-1">
                  <VoteButtons
                    itemId={answer.id}
                    itemType="answer"
                    initialVotes={answer.votes}
                  />
                </div>

                <div className="flex-1 overflow-x-auto">
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

                  <div className="prose prose-brand max-w-none mb-4 sm:pr-6">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        code({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }: any) {
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
                              className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono"
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

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Answered{" "}
                        {formatDistanceToNow(new Date(answer.createdAt))} ago
                      </span>
                      {answer.author && (
                        <span className="text-sm font-medium text-foreground">
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
      <div className="bg-card border border-border rounded p-6">
        <h3 className="text-xl font-semibold mb-4 text-card-foreground">
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
            <MarkdownEditor
              value={watch("content") || ""}
              onChange={(value) => setValue("content", value)}
              placeholder="Write your answer here... You can use markdown formatting like **bold**, *italic*, `code`, and more"
              minHeight="200px"
              className="mt-2"
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || createAnswerMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isSubmitting || createAnswerMutation.isPending
              ? "Submitting..."
              : "Submit Answer"}
          </Button>
        </form>
      </div>
    </div>
  );
}
