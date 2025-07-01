// services/CouponServices.ts
import { ApiServices } from "@/services/interceptor.base";
import { AxiosResponse } from "axios";

interface T extends AxiosResponse<any, any> {}

export class CouponServices extends ApiServices {
  static async getCoupons({
    page = 1,
    pageSize = 10,
    ...filter
  }: Record<string, any>) {
    try {
      const response = await this.get<T>(`/v1/rewards/coupons/list`, {
        params: {
          page,
          limit: pageSize,
          ...filter,
        },
      });
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async getCouponTypes({
    page = 1,
    limit = 10,
    ...filter
  }: Record<string, any>) {
    try {
      const queryString = filter
        ? `?${new URLSearchParams(filter as any).toString()}`
        : "";
      const response = await this.get<T>(
        `/v1/rewards/couponstypes/list${queryString}`,
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async getCouponById(id: number) {
    try {
      const response = await this.get<T>(`/v1/rewards/coupon/${id}`);
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async createCoupon(formData: FormData) {
    try {
      const response = await this.post<T>(
        `/v1/rewards/coupon/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  static async updateCoupon(id: number, formData: FormData) {
    try {
      const response = await this.post<T>(
        `/v1/rewards/coupon/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }

  /**
   * Bulk upload coupons from Excel file
   * @param formData - FormData containing the Excel file with key 'excel', reward_id, and brand_name
   * @returns Promise with API response
   */
  static async bulkUploadCoupons(formData: FormData): Promise<any> {
    try {
      const response = await this.post<T>(
        `/v1/rewards/coupon/bulk-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response;
    } catch (err: any) {
      return { data: null, err: err.message, response: err?.response?.data };
    }
  }
}
