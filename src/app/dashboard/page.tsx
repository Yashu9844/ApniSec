"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";

interface Issue {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byType: {
    cloudSecurity: number;
    reteamAssessment: number;
    vapt: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [newIssue, setNewIssue] = useState({
    type: "Cloud Security",
    title: "",
    description: "",
    priority: "medium"
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIssues();
      fetchStats();
    }
  }, [user, filterType, filterStatus, searchTerm]);

  async function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUser(data.data.user);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }

  async function fetchIssues() {
    const token = localStorage.getItem("token");
    let url = "/api/issues?";
    
    if (filterType) url += `type=${encodeURIComponent(filterType)}&`;
    if (filterStatus) url += `status=${filterStatus}&`;
    if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setIssues(data.data);
    }
  }

  async function fetchStats() {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/issues/stats", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setStats(data.data);
    }
  }

  async function handleCreateIssue(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newIssue)
    });

    if (res.ok) {
      setShowCreateModal(false);
      setNewIssue({
        type: "Cloud Security",
        title: "",
        description: "",
        priority: "medium"
      });
      fetchIssues();
      fetchStats();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to create issue");
    }
  }

  async function handleDeleteIssue(id: string) {
    if (!confirm("Are you sure you want to delete this issue?")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/issues/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      fetchIssues();
      fetchStats();
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <div className="loader-cyber mx-auto mb-6" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] cyber-grid">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00ff88]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00d4ff]/5 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <p className="text-gray-500 text-sm mb-1">Welcome back</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Hello, <span className="text-gradient">{user?.name}</span> 👋
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Issues"
                value={stats.total}
                icon={<TotalIcon />}
                color="purple"
                delay={0}
              />
              <StatCard
                label="Open"
                value={stats.open}
                icon={<OpenIcon />}
                color="cyan"
                delay={0.1}
              />
              <StatCard
                label="In Progress"
                value={stats.inProgress}
                icon={<ProgressIcon />}
                color="yellow"
                delay={0.2}
              />
              <StatCard
                label="Resolved"
                value={stats.resolved}
                icon={<ResolvedIcon />}
                color="green"
                delay={0.3}
              />
            </div>
          )}

          {/* Filters Bar */}
          <div className="glass-card rounded-2xl p-6 mb-6 border border-white/5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="select-cyber"
                >
                  <option value="">All Types</option>
                  <option value="Cloud Security">Cloud Security</option>
                  <option value="Reteam Assessment">Reteam Assessment</option>
                  <option value="VAPT">VAPT</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="select-cyber"
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-cyber pl-12"
                  />
                </div>
              </div>

              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
                className="whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Issue
              </Button>
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            {issues.length === 0 ? (
              <div className="glass-card rounded-2xl p-16 text-center border border-white/5 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No issues found</h3>
                <p className="text-gray-500 mb-6">Create your first security issue to get started</p>
                <Button onClick={() => setShowCreateModal(true)} variant="primary">
                  Create Issue
                </Button>
              </div>
            ) : (
              issues.map((issue, index) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  index={index}
                  onDelete={() => handleDeleteIssue(issue.id)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Create Issue Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-2xl glass-strong rounded-3xl p-8 border border-white/10 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Issue</h2>
                <p className="text-gray-500 text-sm mt-1">Report a security vulnerability or issue</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Issue Type</label>
                  <select
                    value={newIssue.type}
                    onChange={(e) => setNewIssue({ ...newIssue, type: e.target.value })}
                    className="select-cyber"
                    required
                  >
                    <option>Cloud Security</option>
                    <option>Reteam Assessment</option>
                    <option>VAPT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={newIssue.priority}
                    onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value })}
                    className="select-cyber"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  className="input-cyber"
                  placeholder="Brief description of the issue"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  className="input-cyber min-h-[120px] resize-none"
                  placeholder="Detailed description of the security issue..."
                  required
                  minLength={10}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  Create Issue
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  delay
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "green" | "cyan" | "yellow" | "purple";
  delay: number;
}) {
  const colors = {
    green: "from-[#00ff88]/20 to-[#00ff88]/5 border-[#00ff88]/20",
    cyan: "from-[#00d4ff]/20 to-[#00d4ff]/5 border-[#00d4ff]/20",
    yellow: "from-[#eab308]/20 to-[#eab308]/5 border-[#eab308]/20",
    purple: "from-[#a855f7]/20 to-[#a855f7]/5 border-[#a855f7]/20",
  };

  const textColors = {
    green: "text-[#00ff88]",
    cyan: "text-[#00d4ff]",
    yellow: "text-[#eab308]",
    purple: "text-[#a855f7]",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${colors[color]} border p-6 animate-fade-in`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{label}</p>
          <p className={`text-3xl font-bold ${textColors[color]}`}>{value}</p>
        </div>
        <div className={`${textColors[color]} opacity-50`}>{icon}</div>
      </div>
    </div>
  );
}

function IssueCard({ issue, index, onDelete }: { issue: Issue; index: number; onDelete: () => void }) {
  const statusColors: Record<string, string> = {
    open: "badge-green",
    "in-progress": "badge-yellow",
    resolved: "badge-cyan",
    closed: "badge-purple",
  };

  const priorityColors: Record<string, string> = {
    low: "badge-cyan",
    medium: "badge-yellow",
    high: "badge-orange",
    critical: "badge-red",
  };

  return (
    <div
      className="group glass-card rounded-2xl p-6 border border-white/5 hover:border-[#00ff88]/20 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge badge-purple">{issue.type}</span>
            <span className={`badge ${statusColors[issue.status] || "badge-gray"}`}>
              {issue.status}
            </span>
            <span className={`badge ${priorityColors[issue.priority] || "badge-gray"}`}>
              {issue.priority}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
            {issue.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{issue.description}</p>

          {/* Date */}
          <p className="text-xs text-gray-600">
            Created {new Date(issue.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function TotalIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function OpenIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ResolvedIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
