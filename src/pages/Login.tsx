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
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251,146,60,0.85), rgba(249,115,22,0.85)),
            url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEVCejuy6f5IDAb37S8UsWJinmafdXd9kSceUH_LGKRQHfjEe_CZYXedOTljpEByHQ26_QVGkF3Ds8ifxcydix6p2Oe7PzQLmn8XS0U50K-BuuF-8WPWw_S-yj0Oqxby-RxnRdiU4w1WyxRnRHLGiL330isJMnzNaWlHk7cIrLX5G3RaCpYqzzVScDOHIw1_2LmleW1w3--G4sS1kYwk20tSStbZcN7Fsj3ZTlZKAbP1tJSHeVC4Fv202NKiC_Kivo5GafnPWr7GU")
          `,
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

        {/* Main Heading */}
        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <h1
            className="font-extrabold text-white leading-[1.2]"
            style={{ fontSize: "clamp(32px, 3vw, 48px)" }}
          >
            Empowering the Future —<br />
            <span style={{ color: "rgba(255,255,255,0.9)" }}>
              from Campus Desk to<br />
              Corporate Boardroom
            </span>
          </h1>
        </div>

        <p className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 bg-orange-50">
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
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 rounded-lg bg-orange-500 hover:bg-orange-600 flex justify-center items-center gap-2"
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
