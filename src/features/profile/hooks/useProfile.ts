import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "@/api/client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  jobTitle?: string;
  photo?: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  photo?: string;
}

type StoredAuthUser = Record<string, unknown> & {
  name?: string;
  fullName?: string;
  email?: string;
};

const syncStoredUserProfile = (profile: UserProfile) => {
  if (typeof window === "undefined") return;

  try {
    const currentUser = JSON.parse(
      localStorage.getItem("user") ?? "{}",
    ) as StoredAuthUser;
    const nextName =
      profile.name || currentUser.fullName || currentUser.name;

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...currentUser,
        ...profile,
        name: nextName,
        fullName: nextName,
      }),
    );
    localStorage.removeItem("profile_name");
  } catch {
    // Ignore malformed storage and continue with the in-memory cache update.
  }
};

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
        if (data && data.name) {
          return data;
        }
        return { ...(old || {}), ...variables } as UserProfile;
      });
      syncStoredUserProfile(
        data?.name
          ? data
          : { ...(variables as UserProfile), name: variables.name },
      );
    },
  });
};
