"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  
  const router = useRouter();
  const { googleLogin } = useAuth();

  const handleGoogleSignIn = useCallback(
    async (response: any) => {
      setGoogleLoading(true);
      setError("");

      try {
        const result = await api.post("/auth/google", {
          idToken: response.credential,
        });

        googleLogin(result.data.token, result.data.user);
        setIsRedirecting(true);
        router.replace("/dashboard");
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Google sign-in failed";
        setError(errorMsg);
        console.error("Google sign-in error:", err);
      } finally {
        setGoogleLoading(false);
      }
    },
    [router, googleLogin],
  );

  useEffect(() => {
    (window as any).handleGoogleSignIn = handleGoogleSignIn;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
      setError("Google Sign-In is not configured");
    }

    script.onload = () => {
      try {
        if (window.google && clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
          });
          window.google.accounts.id.renderButton(
            document.getElementById("google-button"),
            { theme: "outline", size: "large" },
          );
        }
      } catch (err) {
        console.error("Failed to initialize Google Sign-In:", err);
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleGoogleSignIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin(email, password);
      setIsRedirecting(true);
      router.replace("/dashboard");
    } catch (err: any) {
      setLoading(false);
      const status = err.response?.status;
      const message = err.response?.data?.message || "";

      if (status === 403 && message.includes("verify")) {
        setError(
          "❌ Email not verified. Check your inbox for the verification link or request a new one.",
        );
      } else if (status === 401) {
        setError("❌ Invalid email or password. Please try again.");
      } else if (status === 400) {
        setError(`❌ ${message}`);
      } else if (err.code === "ECONNREFUSED") {
        setError(
          "❌ Connection error. Please check your internet and try again.",
        );
      } else {
        setError(message || "❌ Login failed. Please try again.");
      }
    }
  };

  const handleForgotPasswordClick = async () => {
    if (!forgotEmail.trim()) {
      setForgotMessage("Please enter your email address");
      return;
    }

    setForgotLoading(true);
    setForgotMessage("");

    try {
      console.log("📧 Sending forgot password request for:", forgotEmail);
      const response = await api.post("/auth/forgot-password", {
        email: forgotEmail.toLowerCase().trim(),
      });

      console.log("✅ Forgot password response:", response.data);

      setForgotMessage("✅ " + response.data.message);
      setForgotEmail("");

      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotMessage("");
      }, 3000);
    } catch (err: any) {
      console.error("❌ Forgot password error:", err);
      setForgotMessage(
        "❌ " + (err.response?.data?.message || "Failed to send reset link"),
      );
    } finally {
      setForgotLoading(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
        <p className="mt-4 text-slate-300 font-medium animate-pulse">
          Entering Dashboard...
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-danger-500/10 border border-danger-500/20 text-danger-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div
          id="google-button"
          className="flex justify-center p-3 rounded-xl border border-slate-700 hover:border-slate-600 transition"
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-900 text-slate-400">
              Or continue with email
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
            placeholder="••••••••"
          />

          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(true);
              setForgotMessage("");
              setForgotEmail("");
            }}
            className="text-sm text-primary-500 hover:underline mt-1"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : null}
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-50 mb-4">
              Forgot Password
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="forgotEmail"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
                  disabled={forgotLoading}
                />
              </div>

              <p className="text-xs text-slate-400">
                We&apos;ll send you a link to reset your password.
              </p>

              {forgotMessage && (
                <div
                  className={`p-2 rounded text-sm ${
                    forgotMessage.startsWith("✅")
                      ? "bg-emerald-500/10 text-emerald-200"
                      : "bg-danger-500/10 text-danger-200"
                  }`}
                >
                  {forgotMessage}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotMessage("");
                    setForgotEmail("");
                  }}
                  disabled={forgotLoading}
                  className="btn-secondary flex-1 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  disabled={forgotLoading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {forgotLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : null}
                  {forgotLoading ? "Sending..." : "Send Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
