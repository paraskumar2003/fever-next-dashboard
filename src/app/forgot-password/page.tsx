"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { PasswordRecoveryServices } from "@/services/auth";

type Step = "requestOtp" | "resetPassword" | "success";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("requestOtp");
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateMobile = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(formData.otp.trim())) {
      newErrors.otp = "Please enter a valid 6-digit OTP";
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMobile()) return;
    
    setLoading(true);
    try {
      const response = await PasswordRecoveryServices.requestOtp(formData.mobile);
      
      if (response?.data?.success) {
        toast.success("OTP sent successfully to your mobile number");
        setStep("resetPassword");
      } else {
        toast.error(response?.response?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateResetForm()) return;
    
    setLoading(true);
    try {
      const response = await PasswordRecoveryServices.resetPassword(
        formData.mobile,
        formData.otp,
        formData.newPassword
      );
      
      if (response?.data?.success) {
        setStep("success");
        toast.success("Password reset successfully!");
      } else {
        toast.error(response?.response?.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred while resetting password");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    push("/login");
  };

  const renderRequestOtpStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
        <p className="mt-2 text-gray-600">
          Enter your mobile number to receive an OTP
        </p>
      </div>

      <form onSubmit={handleRequestOtp} className="space-y-4">
        <FormInput
          label="Mobile Number"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Enter your 10-digit mobile number"
          error={errors.mobile}
          required
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );

  const renderResetPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="mt-2 text-gray-600">
          Enter the OTP sent to {formData.mobile} and your new password
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-4">
        <FormInput
          label="OTP"
          name="otp"
          type="text"
          value={formData.otp}
          onChange={handleChange}
          placeholder="Enter 6-digit OTP"
          error={errors.otp}
          maxLength={6}
          required
        />

        <FormInput
          label="New Password"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          error={errors.newPassword}
          required
        />

        <FormInput
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setStep("requestOtp")}
          className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500"
          disabled={loading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mobile Number
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Password Reset Successful</h2>
        <p className="mt-2 text-gray-600">
          Your password has been successfully reset. You can now login with your new password.
        </p>
      </div>

      <Button onClick={handleBackToLogin} className="w-full">
        Back to Login
      </Button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case "requestOtp":
        return renderRequestOtpStep();
      case "resetPassword":
        return renderResetPasswordStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderRequestOtpStep();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {renderCurrentStep()}
      </div>
    </div>
  );
}