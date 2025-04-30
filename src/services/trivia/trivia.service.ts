import { AxiosResponse } from "axios";
import { ApiServices } from "../interceptor.base";

interface T extends AxiosResponse<any, any> {}
export class TriviaServices extends ApiServices {
  static async fetchQuestions(contest_id: string, game_slug: string) {
    try {
      const response = await this.post<T>(`/v1/trivia/questions`, {
        game_slug,
        contest_id,
      });
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async submitAnswer(data: {
    contestId: number;
    questionId: number;
    answer: string;
    missed?: boolean;
  }): Promise<any> {
    try {
      const response = await this.post<T>(`/v1/trivia/submit-answer`, data);
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async flipQuestion(data: {
    contestId: string;
    currentQuestionId: string;
  }): Promise<any> {
    try {
      const response = await this.post<T>(`/v1/trivia/flip-question`, data);
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async getContests(): Promise<any> {
    try {
      const response = await this.get<T>(`/v1/trivia/contests`);
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async getQuestionsByContestId(contest_id: string): Promise<any> {
    try {
      const response = await this.get<T>(
        `/v1/trivia/contest-questions/${contest_id}`,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async deleteQuestion(question_id: string): Promise<any> {
    try {
      const response = await this.get<T>(
        `/v1/trivia/delete-question/${question_id}`,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }
}
