import apiClient from "@/services/apiClient";

export const getAllTransactions = (params: { page: number; size: number; status?: string }) => {
  return apiClient.post("/gratification/get-all-transactions", params);
};

export const exportTransactions = (params: { status?: string }) => {
  return apiClient.post("/gratification/get-all-transactions", params, {
    responseType: "blob", // If you're expecting a file download
  });
};