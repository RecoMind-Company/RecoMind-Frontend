import { useMutation } from "@tanstack/react-query";
import apiClient from "@/app/apiClient";
import toast from "react-hot-toast";

interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (params: ChangePasswordParams) => {
      const { data } = await apiClient.post("/users/changePassword", params);
      return data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!", {
        position: "bottom-center",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage, {
        position: "bottom-center",
      });
    },
  });
};
