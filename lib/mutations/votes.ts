import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, apiRequest } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface VoteData {
  itemId: string;
  itemType: "question" | "answer";
  voteType: "upvote" | "downvote";
  questionId?: string; // Required for answer votes to invalidate the parent question
}

export const useVote = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ itemId, itemType, voteType }: VoteData) => {
      if (!session?.user) {
        router.push("/auth/signin");
        throw new Error("Authentication required");
      }

      const endpoint =
        itemType === "question"
          ? `/api/questions/${itemId}/vote`
          : `/api/answers/${itemId}/vote`;

      return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify({
          userId: session.user.id,
          voteType,
        }),
      });
    },
    onSuccess: (_, { itemId, itemType, questionId }) => {
      // Invalidate related queries
      if (itemType === "question") {
        queryClient.invalidateQueries({ queryKey: queryKeys.questions.detail(itemId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() });
      } else if (itemType === "answer") {
        queryClient.invalidateQueries({ queryKey: queryKeys.answers.detail(itemId) });
        // Invalidate the parent question if questionId is provided
        if (questionId) {
          queryClient.invalidateQueries({ queryKey: queryKeys.questions.detail(questionId) });
        }
      }
    },
    onError: (error) => {
      console.error("Failed to vote:", error);
    },
  });
};