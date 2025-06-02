export interface Coupon {
  id: number;
  type: string;
  brand_name: string;
  coupon_code: string;
  coupon_pin: string;
  coupon_attachment: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CouponFormData {
  type: string;
  brand_name: string;
  rewardId: number;
  couponTypeId: number | string;
  coupon_code: string;
  coupon_pin: string;
  status: number;
  coupon_attachment?: File;
}
