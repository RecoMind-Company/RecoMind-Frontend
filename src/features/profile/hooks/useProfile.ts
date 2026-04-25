import { useQuery } from "@tanstack/react-query";
import apiClient from "@/app/apiClient";

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

export const useProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await apiClient.get("/users/getProfile");
      return data;
    },
    // Only fetch if token exists
    enabled: !!localStorage.getItem("token"),
  });
};
