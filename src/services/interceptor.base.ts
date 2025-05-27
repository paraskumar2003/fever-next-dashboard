import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import Notiflix from "notiflix";

class ApiServices {
  private static instance = axios.create({
    baseURL: process.env.api_url,
    timeout: 30000,
    headers: {
      // "Content-Type": "application/json",
    },
  });

  // Interceptor for requests
  static initializeRequestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        // Add token or any other modifications here
        Notiflix.Loading.circle();
        const token = Cookies.get("authToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        // Notiflix.Loading.dots();
        return config;
      },
      (error) => {
        Notiflix.Loading.remove();
        return Promise.reject(error);
      },
    );
  }

  // Interceptor for responses
  static initializeResponseInterceptor() {
    this.instance.interceptors.response.use(
      (response) => {
        Notiflix.Loading.remove();
        return response;
      },
      (error) => {
        Notiflix.Loading.remove();

        if (error.response?.status === 401) {
          console.error("Unauthorized! Redirecting to login...");
          Cookies.remove("authToken");
        } else {
          Notiflix.Notify.info(
            error?.response?.data?.message || error?.message,
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
