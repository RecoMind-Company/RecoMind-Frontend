import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "@/api/client";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  jobTitle?: string;
  imagePath?: string;
  // Add other fields as per API response
}

export interface UpdateProfilePayload {
  fullName: string;
  email: string;
  phoneNumber?: string;
  jobTitle?: string;
  imagePath?: string;
}

export const useProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await client.get("/users/getProfile");
      return data;
    },
    // Only fetch if token exists
    enabled: !!localStorage.getItem("token"),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, unknown, UpdateProfilePayload>({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await client.put("/users/updateProfile", payload);
      return data as UserProfile;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<UserProfile | undefined>(["profile"], (old) => {
        if (data && data.fullName) {
          return data;
        }
        return { ...(old || {}), ...variables } as UserProfile;
      });
      if (variables.fullName) {
        localStorage.setItem("profile_name", variables.fullName);
      }
    },
  });
};
