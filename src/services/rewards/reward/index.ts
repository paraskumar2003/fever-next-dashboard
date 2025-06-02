import { AxiosResponse } from "axios";
import { ApiServices } from "@/services/interceptor.base";

interface T extends AxiosResponse<any, any> {}

interface RewardsFilter {
  q?: string;
  page?: number;
  pageSize?: number;
}

export class RewardServices extends ApiServices {
  static async getRewards(props?: RewardsFilter) {
    try {
      const response = await this.get<T>(`/v1/rewards/list`, {
        params: {
          page: props?.page || 1,
          limit: props?.pageSize || 10,
          ...(props?.q ? { q: props.q } : {}),
        },
      });
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async getRewardById(id: number) {
    try {
      const response = await this.get<T>(`/v1/rewards/reward/${id}`);
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async createReward(payload: { reward_type: string; name: string }) {
    try {
      const response = await this.post<T>(`/v1/rewards/create-reward`, payload);
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async updateReward(
    id: number,
    payload: { reward_type: string; name: string },
  ) {
    try {
      const response = await this.post<T>(
        `/v1/rewards/update-reward/${id}`,
        payload,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }
}
