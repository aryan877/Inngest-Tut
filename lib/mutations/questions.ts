import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, apiRequest, type QuestionWithAuthor } from "@/lib/api";
import { useRouter } from "next/navigation";

// Mutation function
const createQuestion = async (data: {
  title: string;
  body: string;
  images: string[];
}): Promise<{ data: QuestionWithAuthor }> => {
  return apiRequest("/api/questions", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createQuestion,
    onSuccess: (response) => {
      // Invalidate questions list to refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.questions });

      // Navigate to the new question
      router.push(`/questions/${response.data.id}`);
    },
    onError: (error) => {
      console.error("Failed to create question:", error);
    },
  });
};