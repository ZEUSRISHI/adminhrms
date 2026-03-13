import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { loginUser } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 650));

    const session = loginUser(email.trim(), password);

    setIsLoading(false);

    if (!session) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    setSuccess(true);
    setUser(session);

    await new Promise((r) => setTimeout(r, 500));

    navigate("/", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(150deg, #f97316 0%, #ea580c 45%, #b45309 100%)",
        }}
      >
        {/* Decorative shapes */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 500,
            height: 500,
            background: "rgba(255,255,255,0.07)",
            top: -180,
            left: -160,
          }}
        />

        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 380,
            height: 380,
            background: "rgba(255,255,255,0.06)",
            bottom: -120,
            right: -100,
          }}
        />

        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 220,
            height: 220,
            background: "rgba(255,255,255,0.05)",
            top: "38%",
            left: "42%",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-11 h-11 flex items-center justify-center rounded-2xl"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>

          <div>
            <span className="text-white text-xl font-bold block">
              QuiboTech
            </span>
            <span className="text-orange-200 text-xs">Admin Platform</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <h1
            className="font-extrabold text-white leading-[1.2]"
            style={{ fontSize: "clamp(32px, 3vw, 48px)" }}
          >
            Empowering the Future —<br />
            <span style={{ color: "rgba(255,255,255,0.85)" }}>
              from Campus Desk to<br />
              Corporate Boardroom
            </span>
          </h1>
        </div>

        <p className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} QuiboTech · All rights reserved
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 bg-gray-50">
        <div className="w-full max-w-[420px] bg-white rounded-2xl border shadow-sm p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
            <p className="text-sm text-gray-500">
              Welcome back — enter your credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex gap-2 text-green-600 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Login successful
              </div>
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg px-4 py-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-3 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 rounded-lg bg-orange-500 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}