import { axiosAuth } from "../../../config";

export interface ResetPasswordPayload {
  newPassword: string;
  confirmNewPassword: string;
}

export const updatePassword = async (
  email: string,
  data: ResetPasswordPayload,
) => {
  const encodedEmail = encodeURIComponent(email);
  return axiosAuth.put(`/update-password?email=${encodedEmail}`, data);
};
