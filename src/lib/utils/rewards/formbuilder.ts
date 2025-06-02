import { CouponFormData } from "@/types/coupon";

export function buildCouponFormData(formData: CouponFormData): FormData {
  const fd = new FormData();

  fd.append("type", formData.type);
  fd.append("brand_name", formData.brand_name);
  fd.append("rewardId", formData.rewardId.toString());
  fd.append("couponTypeId", formData.couponTypeId.toString());
  fd.append("coupon_code", formData.coupon_code);
  fd.append("coupon_pin", formData.coupon_pin);
  fd.append("status", formData.status.toString());

  if (formData.coupon_attachment instanceof File) {
    fd.append("coupon_attachment", formData.coupon_attachment);
  }

  return fd;
}