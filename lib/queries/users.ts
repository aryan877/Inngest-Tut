import { useQuery } from "@tanstack/react-query";
import { queryKeys, apiRequest, type UserWithProfile } from "@/lib/api";

// API response types
export interface UserResponse {
  data: UserWithProfile;
}

// Query functions
const getUser = async (id: string): Promise<UserResponse> =>
  apiRequest(`/api/users/${id}`);

// Query hooks
export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};