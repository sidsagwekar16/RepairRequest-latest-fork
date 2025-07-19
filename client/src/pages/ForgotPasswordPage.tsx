import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft } from "lucide-react";
import { stackClientApp } from "../lib/stackClientApp";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    try {
      const result = await stackClientApp.sendForgotPasswordEmail(email);
      if (result.status === "success") {
        setSuccess("A password reset email has been sent if the account exists.");
      } else {
        setError(result.error?.message || "User not found.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full flex">
        {/* Left Panel - Forgot Password Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-semibold text-gray-900">Repair Request</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600 text-sm">Enter your email and we'll send you a password reset link.</p>
          </div>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            {success && <div className="text-green-600 text-sm mb-2">{success}</div>}

            {/* Back to Login */}
            <div className="flex items-center justify-between mb-6">
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700">
                <div className="flex items-center">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span>Back to login</span>
                </div>
              </Link>
            </div>

            {/* Send Email Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium mb-6"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Create an account
            </Link>
          </div>
        </div>

        {/* Right Panel - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600"></div>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-white"></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 rounded-full bg-white"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center text-white p-12 text-center">
            <div className="mb-8 relative"></div>
            {/* Text Content */}
            <h1 className="text-3xl font-extrabold mb-4 leading-tight">Forgot Password</h1>
            <p className="text-lg text-white/80">
              Enter your email and we'll help you regain access to your account.
            </p>
            <div className="flex gap-2 mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;