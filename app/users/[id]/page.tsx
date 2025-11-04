"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/lib/queries";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const { data, isLoading, error } = useUser(userId);

  if (isLoading) {
    return <div className="max-w-5xl mx-auto">Loading profile...</div>;
  }

  if (error || !data?.data) {
    return <div className="max-w-5xl mx-auto">Error loading profile</div>;
  }

  const userData = data.data;
  const profile = userData.profile;

  return (
    <div className="max-w-5xl mx-auto">
      {/* User Header */}
      <div className="bg-card p-8 mb-8 rounded shadow-sm">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userData.image || undefined} alt={userData.name} />
            <AvatarFallback className="text-2xl bg-muted text-foreground">
              {userData.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="font-outfit text-3xl font-bold mb-2 text-card-foreground">
              {userData.name}
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
                <div className="text-sm text-muted-foreground">Reputation</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">
                  {profile?.questionsCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">
                  {profile?.answersCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">Answers</div>
              </div>
              <div>
                <div className="text-sm font-medium text-card-foreground">
                  {formatDistanceToNow(new Date(userData.createdAt))} ago
                </div>
                <div className="text-sm text-muted-foreground">Member for</div>
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

      {/* User Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-6 border border-border rounded">
          <h2 className="font-heading text-xl font-bold mb-4 text-card-foreground">
            Questions
          </h2>
          <div className="text-3xl font-bold text-card-foreground mb-2">
            {profile?.questionsCount || 0}
          </div>
          <p className="text-sm text-muted-foreground">Total questions asked</p>
        </div>

        <div className="bg-card p-6 border border-border rounded">
          <h2 className="font-heading text-xl font-bold mb-4 text-card-foreground">
            Answers
          </h2>
          <div className="text-3xl font-bold text-card-foreground mb-2">
            {profile?.answersCount || 0}
          </div>
          <p className="text-sm text-muted-foreground">Total answers provided</p>
        </div>
      </div>
    </div>
  );
}
