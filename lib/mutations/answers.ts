import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, apiRequest } from "@/lib/api";

interface CreateAnswerData {
  questionId: string;
  content: string;
  images: string[];
}

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, content, images }: CreateAnswerData) => {
      return apiRequest(`/api/questions/${questionId}/answers`, {
        method: "POST",
        body: JSON.stringify({
          content,
          images,
        }),
      });
    },
    onSuccess: (_, { questionId }) => {
      // Invalidate the specific question to refresh answers
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.detail(questionId) });
    },
    onError: (error) => {
      console.error("Failed to create answer:", error);
    },
  });
};