"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Static token
    localStorage.setItem("token", "dummy_token_123");

    // Show modal
    setShowModal(true);

    // Auto redirect after 5 seconds
    setTimeout(() => push("/wheel-of-fortune"), 5000);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://source.unsplash.com/1920x1080/?abstract,technology)",
      }}
    >
      <div className="w-96 rounded-2xl border border-white/20 bg-white bg-opacity-10 p-8 shadow-xl backdrop-blur-lg">
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
              className="peer w-full rounded-lg border border-white/30 bg-transparent px-3 pb-2 pt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={form.username ? "" : "Username"}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="peer w-full rounded-lg border border-white/30 bg-transparent px-3 pb-2 pt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={form.password ? "" : "Password"}
            />
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
              onClick={() => push("/wheel-of-fortune")}
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
