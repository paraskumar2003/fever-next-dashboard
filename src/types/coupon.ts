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
