"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import type { VoteButtonsProps } from "@/lib/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function VoteButtons({
  itemId,
  itemType,
  initialVotes,
  userVote: initialUserVote,
}: VoteButtonsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint =
        itemType === "question"
          ? `/api/questions/${itemId}/vote`
          : `/api/answers/${itemId}/vote`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          voteType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to vote");
      }

      // Update local state optimistically
      if (userVote === voteType) {
        // Toggle off
        setVotes(votes + (voteType === "upvote" ? -1 : 1));
        setUserVote(null);
      } else if (userVote) {
        // Change vote
        setVotes(votes + (voteType === "upvote" ? 2 : -2));
        setUserVote(voteType);
      } else {
        // New vote
        setVotes(votes + (voteType === "upvote" ? 1 : -1));
        setUserVote(voteType);
      }
    } catch (error: any) {
      console.error("Error voting:", error);
      alert(error.message || "Failed to vote");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("upvote")}
        disabled={isLoading}
        className={userVote === "upvote" ? "text-primary" : ""}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>

      <span
        className={`font-semibold ${votes > 0 ? "text-green-600" : votes < 0 ? "text-red-600" : ""}`}
      >
        {votes}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("downvote")}
        disabled={isLoading}
        className={userVote === "downvote" ? "text-primary" : ""}
      >
        <ArrowDown className="h-5 w-5" />
      </Button>
    </div>
  );
}
