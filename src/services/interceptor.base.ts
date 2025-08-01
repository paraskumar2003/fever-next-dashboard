import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// Global loading state
let globalLoadingState: ((loading: boolean) => void) | null = null;

export const setGlobalLoadingHandler = (handler: (loading: boolean) => void) => {
  globalLoadingState = handler;
};
class ApiServices {
  private static instance = axios.create({
    baseURL: process.env.api_url,
    timeout: 60000,
    headers: {
      // "Content-Type": "application/json",
    },
  });

  // Interceptor for requests
  static initializeRequestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        // Add token or any other modifications here
        if (globalLoadingState) {
          globalLoadingState(true);
        }
        // Get token from cookies (client-side) or from headers (server-side)
        let token: string | undefined;

        if (typeof window !== "undefined") {
          // Client-side: get from cookies
          token = Cookies.get("authToken");
        } else {
          // Server-side: get from request headers if available
          token = config.headers?.["Authorization"]
            ?.toString()
            .replace("Bearer ", "");
        }

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        if (globalLoadingState) {
          globalLoadingState(false);
        }
        return Promise.reject(error);
      },
    );
  }

  // Interceptor for responses
  static initializeResponseInterceptor() {
    this.instance.interceptors.response.use(
      (response) => {
        if (globalLoadingState) {
          globalLoadingState(false);
        }
        return response;
      },
      (error) => {
        if (globalLoadingState) {
          globalLoadingState(false);
        }

        if (error.response?.status === 401) {
          console.error("Unauthorized! Redirecting to login...");
          // Remove token from cookies and redirect to login
          if (typeof window !== "undefined") {
            Cookies.remove("authToken");
            window.location.href = "/login";
          }
        } else {
          toast.error(
            typeof error?.response?.data?.message == "string"
              ? error?.response?.data?.message
              : error.response.data.message[0] || error?.message,
          );
        }
        return Promise.reject(error);
      },
    );
  }

  // Generic GET request
  static async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  // Generic POST request
  static async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  // Generic PUT request
  static async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  // Generic DELETE request
  static async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }
}

// Initialize interceptors
ApiServices.initializeRequestInterceptor();
ApiServices.initializeResponseInterceptor();

export { ApiServices };
