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

interface InstructionPayload {
  contestId: string; // UUID format
  title: string;
  description: string;
}

interface UpdateContestQuestionPayload {
  contestId: number;
  questionIds: number[];
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
        `/v1/trivia/update-question/${id}`,
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
      const response = await this.get<T>(`/v1/trivia/questions/${question_id}`);
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

  static async createInstruction(payload: InstructionPayload): Promise<any> {
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

  static async getAllQuestions() {
    try {
      const response = await this.get<T>(`/v1/trivia/questions`);
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
