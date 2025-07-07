"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthServices } from "@/services/auth";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [showModal, setShowModal] = useState(false);
  const { push } = useRouter();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

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
      // Auto redirect after 5 seconds
      setShowModal(true);
      setTimeout(() => push("/home"), 5000);
    }

    // Show modal
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://source.unsplash.com/1920x1080/?abstract,technology)",
      }}
    >
      <div className="w-96 rounded-2xl border border-black/20 bg-white bg-opacity-10 p-8 shadow-xl backdrop-blur-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="peer w-full rounded-lg border border-black/30 bg-transparent px-3 pb-2 pt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={form.username ? "" : "Username"}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="peer w-full rounded-lg border border-black/30 bg-transparent px-3 pb-2 pt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={form.password ? "" : "Password"}
            />

            {/* Toggle Icon */}
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
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
              className="h-4 w-4 accent-blue-500"
            />
            <label htmlFor="remember" className="text-sm">
              Remember Me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="text-4xl text-green-500">✔</div>
            <h2 className="mt-2 text-xl font-semibold">
              Successfully Logged In!
            </h2>
            <button
              onClick={() => push("/home")}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
