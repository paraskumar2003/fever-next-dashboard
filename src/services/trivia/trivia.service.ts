import { AxiosResponse } from "axios";
import { ApiServices } from "../interceptor.base";

interface AnswerPayload {
  answer: string;
  isCorrect: boolean;
}

interface QuestionPayload {
  question: string;
  status: number; // Assuming 1 means active, 0 means inactive, etc.
  answers: AnswerPayload[];
  timer: string; // Assuming this is in milliseconds as a string
}

interface QuestionFilter {
  q?: string;
  page?: number;
  limit?: number;
}

export interface InstructionPayload {
  contestId: string; // UUID format
  instructions: string;
  megaPrizeName: string;
  sponsored_logo: File;
}

interface UpdateContestQuestionPayload {
  contestId: number;
  questionIds: number[];
}

interface ContestSearchFilter {
  category?: string;
}
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

  static async getContests(filter?: ContestSearchFilter): Promise<any> {
    try {
      const queryString = filter
        ? `?${new URLSearchParams(filter as any).toString()}`
        : "";
      const response = await this.get<T>(`/v1/trivia/contests${queryString}`);
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

  static async postGameQuestionForm(form: any): Promise<any> {
    try {
      const response = await this.post<T>(`/v1/trivia/contest-questions`, form);
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async createQuestion(payload: QuestionPayload): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/trivia/create-question`,
        payload,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async updateQuestion(
    payload: QuestionPayload,
    id: string | number,
  ): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/questions/update-question/${id}`,
        payload,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async deleteQuestion(question_id: string): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/trivia/delete-question/${question_id}`,
        {},
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async getQuestionById(question_id: string): Promise<any> {
    try {
      const response = await this.get<T>(
        `/v1/questions/questions/${question_id}`,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async getInstructionByContestId(contest_id: string): Promise<any> {
    try {
      const response = await this.get<T>(
        `/v1/trivia/instructions/${contest_id}`,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async createInstruction(payload: any): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/trivia/create-instructions`,
        payload,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async getAllQuestions({
    page = 1,
    limit = 10,
    ...filter
  }: QuestionFilter) {
    try {
      const response = await this.get<T>(`/v1/questions/list`, {
        params: {
          page: page,
          limit: limit,
          ...(filter.q ? { q: filter.q } : {}),
        },
      });
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async updateContestQuestions(
    contestQuestionIds: number[],
    contest_id: number,
  ) {
    try {
      let payload: UpdateContestQuestionPayload = {
        questionIds: contestQuestionIds,
        contestId: contest_id,
      };
      const response = await this.post<T>(
        `/v1/trivia/update-contest-questions`,
        payload,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }
}
