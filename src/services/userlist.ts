import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

// Define the expected structure of the video response
export interface UserList {
  uid: number;
  name: string;
  kyc_status: boolean;
  club_name: string;
  club_code: string;
  created_at: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: UserList[];
  total: number; // Assuming your API returns the total number of records
}

class UserListService {
  static async fetchUserList(
    limit: number,
    offset: number,
  ): Promise<UserListResponse> {
    const url = `${process.env.api_url}admin/allUser?limit=${limit}&offset=${offset}`;
    console.log("UserList API URL:", url);

    try {
      const token = Cookies.get("authToken");
      console.log("token", token);
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json", // Ensure headers are initialized
        },
      };

      // If the token exists, add it to the headers
      if (token) {
        config.headers = {
          ...config.headers, // Ensure it's always an object
          Authorization: `Bearer ${token}`,
        };
      }

      const response: AxiosResponse<UserListResponse> = await axios.get(
        url,
        config,
      );
      console.log("API Response:", response.data);
      return response.data; // Return only the data part of the response
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error;
    }
  }
}

export { UserListService };
