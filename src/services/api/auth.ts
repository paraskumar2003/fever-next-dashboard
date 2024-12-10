import apiClient from "@/services/apiClient";

export const login = (values: { email: string; password: string }) => {
  return apiClient.post("/auth/login", values);
};
