import { AxiosResponse } from "axios";
import { ApiServices } from "../interceptor.base";

interface RequestOtpPayload {
  mobile: string;
}

interface ResetPasswordPayload {
  mobile: string;
  otp: string;
  newPassword: string;
}

interface T extends AxiosResponse<any, any> {}

export class PasswordRecoveryServices extends ApiServices {
  /**
   * Request OTP for password recovery
   * @param mobile - Mobile number for OTP request
   * @returns Promise with API response
   */
  static async requestOtp(mobile: string): Promise<any> {
    try {
      const payload: RequestOtpPayload = { mobile };
      const response = await this.post<T>(
        "/v1/users/dashboard/forgot-password/request-otp",
        payload
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
   * Reset password using OTP
   * @param mobile - Mobile number
   * @param otp - OTP received on mobile
   * @param newPassword - New password to set
   * @returns Promise with API response
   */
  static async resetPassword(
    mobile: string,
    otp: string,
    newPassword: string
  ): Promise<any> {
    try {
      const payload: ResetPasswordPayload = {
        mobile,
        otp,
        newPassword,
      };
      const response = await this.post<T>(
        "/v1/users/dashboard/forgot-password/reset",
        payload
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
}