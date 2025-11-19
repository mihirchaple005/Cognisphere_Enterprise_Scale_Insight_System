/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/config/firebaseClient";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, formData.email);
        showNotification("Password reset email sent! Check your inbox.", "success");
        setIsForgotPassword(false);
      } else if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        showNotification("Login successful!", "success");
        router.push(`/${res.user.uid}`);
      } else {
        if (formData.password !== formData.confirmPassword) {
          showNotification("Passwords do not match!", "error");
          setLoading(false);
          return;
        }
        const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = res.user;
        const idToken = await user.getIdToken();
        await axios.post("/api/user_info", { email: formData.email, idToken });
        showNotification("Account created successfully!", "success");
        router.replace(`/${user.uid}`);
      }
    } catch (error: any) {
      const errorMap: Record<string, string> = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/email-already-in-use": "Email already in use.",
        "auth/invalid-email": "Invalid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",

      };
      showNotification(errorMap[error.code] || "Authentication failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user=res.user
      const idToken=await user.getIdToken();
      const email= user.email
      await axios.post("/api/user_info", { email: email, idToken });
      showNotification("Google Sign-in successful!", "success");
      router.push(`/${user.uid}`);
    } catch (error:any) {
      if(error.code==="auth/popup-closed-by-user"){
        showNotification("Pop-up closed by the user!", "error");
      }
      else showNotification("Google sign-in failed!", "error");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* ✅ Notification popup */}
      {notification && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl ${
              notification.type === "success"
                ? "bg-green-600 border border-green-500"
                : "bg-red-600 border border-red-500"
            } text-white`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isForgotPassword
                ? "Reset Password"
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </h2>
            <p className="text-slate-400 text-sm">
              {isForgotPassword
                ? "Enter your email to receive a reset link"
                : isLogin
                ? "Welcome back to Enterprise KG"
                : "Get started with your account"}
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            {!isForgotPassword && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        required
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {isLogin && !isForgotPassword && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isForgotPassword ? (
                "Send Reset Link"
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Google Button + Toggle Links */}
          {!isForgotPassword && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-slate-900 text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-slate-50 disabled:bg-slate-200 disabled:cursor-not-allowed text-slate-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    {isLogin ? "Sign up here" : "Sign in here"}
                  </button>
                </p>
              </div>
            </>
          )}

          {isForgotPassword && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
