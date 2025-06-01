import { AxiosResponse } from "axios";
import { ApiServices } from "../interceptor.base";

interface T extends AxiosResponse<any, any> {}

interface ContestPrize {
  reward_id: number;
  coupon_type_id: number;
  prize_name: string;
  bucks: number;
}

interface ContestPrizePayload {
  contest_id: number;
  prizes: ContestPrize[];
}

export class ContestServices extends ApiServices {
  static async getContestById(contest_id: string) {
    try {
      const response = await this.get<T>(`/v1/trivia/contests/${contest_id}`);
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async createContest(formData: any) {
    try {
      const response = await this.post<T>(
        `/v1/trivia/create-contest`,
        formData,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async createContestPrize(payload: ContestPrizePayload) {
    try {
      const response = await this.post<T>(
        `/v1/trivia/contest-prize`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }
}