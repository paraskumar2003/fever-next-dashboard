import { AxiosResponse } from "axios";
import { ApiServices } from "../interceptor.base";
export * from "./password-recovery";

interface LoginPayload {
  email: string;
  password: string;
}

interface T extends AxiosResponse<any, any> {}

export class AuthServices extends ApiServices {
  static async dashboardLogin(payload: LoginPayload): Promise<any> {
    try {
      const response = await this.post<T>("/v1/users/dashboard-login", payload);
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
