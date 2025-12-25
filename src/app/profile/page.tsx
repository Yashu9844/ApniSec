"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  async function checkAuthAndFetchProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUser(data.data);
      setFormData({
        name: data.data.name,
        email: data.data.email,
        password: "",
        confirmPassword: ""
      });
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setUpdating(true);

    const token = localStorage.getItem("token");
    const updateData: any = {
      name: formData.name,
      email: formData.email
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to update profile");
        return;
      }

      setMessage("Profile updated successfully!");
      setUser(data.data);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: ""
      });

      await checkAuthAndFetchProfile();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <div className="loader-cyber mx-auto mb-6" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] cyber-grid">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-[#a855f7]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-[#00ff88]/5 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#00ff88] transition-colors mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Profile <span className="text-gradient">Settings</span>
            </h1>
            <p className="text-gray-500">Manage your account settings and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="glass-card rounded-3xl p-8 border border-white/5 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00ff88] via-[#00d4ff] to-[#a855f7] p-0.5">
                  <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center">
                    <span className="text-3xl font-bold text-gradient">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00ff88] border-2 border-[#0a0a0a] flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge badge-green">Active</span>
                  <span className="text-xs text-gray-600">
                    Member since {new Date(user?.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Form */}
          <div className="glass-strong rounded-3xl p-8 border border-white/10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold text-white mb-6">Update Profile</h3>

            {/* Success Message */}
            {message && (
              <div className="mb-6 p-4 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] rounded-xl animate-fade-in">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{message}</span>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-cyber pl-12"
                    required
                    minLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-cyber pl-12"
                    required
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-6 border-t border-white/5">
                <h4 className="text-sm font-medium text-gray-400 mb-4">
                  Change Password
                  <span className="text-gray-600 font-normal ml-2">(leave blank to keep current)</span>
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input-cyber pl-12"
                        placeholder="••••••••"
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="input-cyber pl-12"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={updating}
              >
                Save Changes
              </Button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 p-8 rounded-3xl border border-red-500/20 bg-red-500/5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Once you delete your account, there is no going back. All your data will be permanently removed.
                </p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => alert("Account deletion not yet implemented")}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
