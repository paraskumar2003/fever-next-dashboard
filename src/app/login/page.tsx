"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthServices } from "@/services/auth";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import Link from "next/link";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthServices.dashboardLogin({
        email: form.username,
        password: form.password,
      });

      if (response?.data?.data.accessToken) {
        // Set token in cookie with 7 days expiry
        Cookies.set("authToken", response?.data?.data.accessToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        toast.success("Login successful! Redirecting...");
        setTimeout(() => push("/home"), 1000);
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              placeholder="Enter your password"
            />

            {/* Toggle Icon */}
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="remember" className="text-sm text-gray-700">
              Remember Me
            </label>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="mb-2 text-gray-600">
            <Link
              href="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
      <></>
    </div>
  );
}
