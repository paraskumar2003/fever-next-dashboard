import { AxiosResponse } from "axios";
import { ApiServices } from "../interceptor.base";

interface QuestionSetPayload {
  categoryId: number;
  name: string;
  description: string;
}

interface QuestionSetFilter {
  q?: string;
  page?: number;
  limit?: number;
}

interface T extends AxiosResponse<any, any> {}

export class QuestionSetServices extends ApiServices {
  /**
   * Create a new question set
   * POST /v1/questions/create-questionset
   */
  static async createQuestionSet(payload: QuestionSetPayload): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/questions/create-questionset`,
        payload,
      );
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        response: err?.response?.data,
      };
    }
  }

  /**
   * Update an existing question set
   * POST /v1/questions/update-questionset/:id
   */
  static async updateQuestionSet(
    id: string | number,
    payload: QuestionSetPayload,
  ): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/questions/update-questionset/${id}`,
        payload,
      );
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        response: err?.response?.data,
      };
    }
  }

  /**
   * Delete a question set
   * POST /v1/questions/delete-questionset/:id
   */
  static async deleteQuestionSet(id: string | number): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/questions/delete-questionset/${id}`,
        {},
      );
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        response: err?.response?.data,
      };
    }
  }

  /**
   * Get a question set by ID
   * GET /v1/questions/questionsets/:id
   */
  static async getQuestionSetById(id: string | number): Promise<any> {
    try {
      const response = await this.get<T>(`/v1/questions/questionsets/${id}`);
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        response: err?.response?.data,
      };
    }
  }

  /**
   * Get all question sets with optional filtering
   * GET /v1/questions/questionsets/
   */
  static async getAllQuestionSets({
    page = 1,
    limit = 10,
    ...filter
  }: QuestionSetFilter = {}): Promise<any> {
    try {
      const response = await this.get<T>(`/v1/questions/questionsets/`, {
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
}
