"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";

async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) {
    return <div className="max-w-5xl mx-auto">Loading profile...</div>;
  }

  if (error || !data?.data) {
    return <div className="max-w-5xl mx-auto">Error loading profile</div>;
  }

  const { user, profile, questions, answers } = data.data;

  return (
    <div className="max-w-5xl mx-auto">
      {/* User Header */}
      <div className="bg-card p-8 mb-8 rounded shadow-sm">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl bg-muted text-foreground">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="font-outfit text-3xl font-bold mb-2 text-card-foreground">
              {user.name}
            </h1>
            {profile?.bio && (
              <p className="text-sm text-muted-foreground mb-4">
                {profile.bio}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-card-foreground">
                  {profile?.reputation || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Reputation
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">
                  {profile?.questionsCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Questions
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">
                  {profile?.answersCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Answers
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-card-foreground">
                  {formatDistanceToNow(new Date(user.createdAt))} ago
                </div>
                <div className="text-sm text-muted-foreground">
                  Member for
                </div>
              </div>
            </div>

            {profile && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {profile.location && (
                  <span className="text-muted-foreground">
                    📍 {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline hover:no-underline"
                  >
                    🔗 {profile.website}
                  </a>
                )}
                {profile.githubHandle && (
                  <a
                    href={`https://github.com/${profile.githubHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline hover:no-underline"
                  >
                    🐙 {profile.githubHandle}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Questions and Answers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Questions */}
        <div>
          <h2 className="font-heading text-2xl font-bold mb-4 text-card-foreground">
            Recent Questions
          </h2>
          <div className="space-y-4">
            {questions && questions.length > 0 ? (
              questions.map((question: any) => (
                <div
                  key={question.id}
                  className="bg-card p-4 border border-border rounded hover:shadow-sm transition-shadow"
                >
                  <Link href={`/questions/${question.id}`}>
                    <h3 className="font-semibold mb-2 text-card-foreground hover:text-muted-foreground transition-colors">
                      {question.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium">{question.votes} votes</span>
                    <span>{question.views} views</span>
                    <span>
                      {formatDistanceToNow(new Date(question.createdAt))} ago
                    </span>
                  </div>
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {question.tags.slice(0, 3).map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No questions yet</p>
            )}
          </div>
        </div>

        {/* Recent Answers */}
        <div>
          <h2 className="font-heading text-2xl font-bold mb-4 text-card-foreground">
            Recent Answers
          </h2>
          <div className="space-y-4">
            {answers && answers.length > 0 ? (
              answers.map((answer: any) => (
                <div
                  key={answer.id}
                  className="bg-card p-4 border border-border rounded hover:shadow-sm transition-shadow"
                >
                  <Link href={`/questions/${answer.question.id}`}>
                    <div className="text-sm text-muted-foreground mb-1">
                      Answered: {answer.question.title}
                    </div>
                  </Link>
                  <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {answer.content.substring(0, 150)}...
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium">{answer.votes} votes</span>
                    <span>
                      {formatDistanceToNow(new Date(answer.createdAt))} ago
                    </span>
                    {answer.isAiGenerated && (
                      <Badge variant="outline" className="text-xs">
                        AI
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No answers yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
