import { AxiosResponse } from "axios";
import { ApiServices } from "../interceptor.base";

interface CategoryPayload {
  name: string;
  description: string;
  status?: number;
}

interface CategoryFilter {
  q?: string;
  page?: number;
  limit?: number;
}

interface T extends AxiosResponse<any, any> {}

export class CategoryServices extends ApiServices {
  static async getAllCategories({
    page = 1,
    limit = 10,
    ...filter
  }: CategoryFilter): Promise<any> {
    try {
      const response = await this.get<T>("/v1/questions/categories", {
        params: {
          page: page,
          limit: limit,
          ...(filter.q ? { q: filter.q } : {}),
        },
      });
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        response: err?.response?.data,
      };
    }
  }

  static async getCategoroiesWithCount(): Promise<any> {
    try {
      const response = await this.get<T>("/v1/trivia/questions-sets");
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        response: err?.response?.data,
      };
    }
  }

  static async getCategoryById(categoryId: string): Promise<any> {
    try {
      const response = await this.get<T>(
        `/v1/questions/categories/${categoryId}`,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async createCategory(payload: CategoryPayload): Promise<any> {
    try {
      // Using the direct API endpoint with the provided token
      const response = await this.post<T>(
        `/v1/questions/create-category`,
        payload,
      );

      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async updateCategory(
    categoryId: string,
    payload: CategoryPayload,
  ): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/questions/update-category/${categoryId}`,
        payload,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async deleteCategory(categoryId: string): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/questions/delete-category/${categoryId}`,
        {},
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }
}
