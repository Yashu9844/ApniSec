"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["bg-gray-700", "bg-red-500", "bg-yellow-500", "bg-[#00ff88]"];
  const strengthLabels = ["", "Weak", "Medium", "Strong"];

  return (
    <div className="min-h-screen bg-[#030303] cyber-grid overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 pb-8 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="glass-strong rounded-3xl p-8 md:p-10 border border-white/10 animate-scale-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#a855f7] to-[#00d4ff] rounded-2xl mb-6 shadow-lg shadow-[#a855f7]/20">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
              <p className="text-gray-500">Start securing your infrastructure today</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] rounded-xl animate-fade-in">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{success}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl animate-fade-in">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  {!name && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`input-cyber ${!name ? 'pl-12' : 'pl-5'}`}
                    placeholder={name ? '' : '    John Doe'}
                    required
                    minLength={2}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  {!email && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`input-cyber ${!email ? 'pl-12' : 'pl-5'}`}
                    placeholder={email ? '' : '    you@company.com'}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  {!password && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`input-cyber ${!password ? 'pl-12' : 'pl-5'}`}
                    placeholder={password ? '' : '    ••••••••••'}
                    required
                    minLength={8}
                  />
                </div>
                {/* Password Strength */}
                {password.length > 0 && (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordStrength ? strengthColors[passwordStrength] : "bg-gray-800"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${passwordStrength === 3 ? "text-[#00ff88]" : passwordStrength === 2 ? "text-yellow-500" : "text-red-400"}`}>
                      {strengthLabels[passwordStrength]} password
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 rounded bg-white/5 border-white/20 text-[#00ff88] focus:ring-[#00ff88] focus:ring-offset-0"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the{" "}
                  <Link href="#" className="text-[#00d4ff] hover:text-[#00ff88] transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#00d4ff] hover:text-[#00ff88] transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={loading}
              >
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#00ff88] hover:text-[#00d4ff] font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <FeatureItem icon="🔒" text="Secure" />
            <FeatureItem icon="⚡" text="Fast" />
            <FeatureItem icon="🌐" text="Global" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl bg-white/5 border border-white/5">
      <span className="text-xl">{icon}</span>
      <span className="text-xs text-gray-500">{text}</span>
    </div>
  );
}
