"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] cyber-grid overflow-hidden">
      <Navbar />
      
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-[#00d4ff]/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#a855f7]/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#00ff88] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
            </span>
            <span className="text-sm text-gray-300">Now with AI-Powered Threat Detection</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.9] tracking-tight animate-fade-in-up">
            <span className="block text-white">Defend Your</span>
            <span className="block neon-green">Digital Fortress</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Enterprise-grade security platform that helps you discover vulnerabilities, 
            track threats, and protect your infrastructure with military-precision tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link href="/register">
              <Button variant="primary" size="lg">
                Start Free Trial
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <TrustBadge icon="🔒" text="256-bit Encryption" />
            <TrustBadge icon="⚡" text="99.9% Uptime" />
            <TrustBadge icon="🛡️" text="SOC 2 Compliant" />
            <TrustBadge icon="🌐" text="Global CDN" />
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl">
              <div className="glass-card rounded-2xl p-1 border border-white/10">
                <div className="bg-[#0a0a0a] rounded-xl overflow-hidden">
                  {/* Mock Dashboard */}
                  <div className="p-4 border-b border-white/5 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 bg-white/5 rounded-lg text-xs text-gray-500">
                        dashboard.apnisec.com
                      </div>
                    </div>
                  </div>
                  <div className="p-8 grid grid-cols-4 gap-4">
                    <StatCard value="2,847" label="Threats Blocked" color="green" />
                    <StatCard value="156" label="Active Scans" color="cyan" />
                    <StatCard value="99.9%" label="System Uptime" color="purple" />
                    <StatCard value="24/7" label="Monitoring" color="pink" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-semibold uppercase tracking-wider mb-6">
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Built for </span>
              <span className="neon-cyan">Security Teams</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg">
              Everything you need to manage security at scale. From vulnerability scanning 
              to incident response, we have got you covered.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why ApniSec Section */}
      <section id="about" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-xs font-semibold uppercase tracking-wider mb-6">
                Why ApniSec
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="text-white">Security that </span>
                <span className="neon-green">never sleeps</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                In a world where cyber threats evolve by the minute, you need a platform 
                that is always one step ahead. ApniSec combines cutting-edge AI with 
                battle-tested security protocols.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 border border-[#00ff88]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-xl">{benefit.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-gray-500 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 rounded-3xl blur-3xl" />
              <div className="relative glass-card rounded-2xl p-8 border border-white/10">
                <div className="space-y-6">
                  <MetricRow label="Threat Detection Rate" value="99.97%" color="green" />
                  <MetricRow label="Average Response Time" value="< 50ms" color="cyan" />
                  <MetricRow label="False Positive Rate" value="0.003%" color="purple" />
                  <MetricRow label="Uptime SLA" value="99.99%" color="pink" />
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Trusted by</p>
                      <p className="text-white font-bold text-2xl">500+ Companies</p>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#0a0a0a] flex items-center justify-center text-xs text-gray-400"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/20 via-[#00d4ff]/20 to-[#a855f7]/20 rounded-3xl blur-3xl" />
            <div className="relative glass-strong rounded-3xl p-12 md:p-16 text-center border border-white/10 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '32px 32px'
                }} />
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  <span className="text-white">Ready to </span>
                  <span className="text-gradient">get started?</span>
                </h2>
                <p className="max-w-xl mx-auto text-gray-400 text-lg mb-10">
                  Join thousands of security professionals who trust ApniSec to protect 
                  their digital infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register">
                    <Button variant="primary" size="lg">
                      Start Your Free Trial
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="ghost" size="lg">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  const colors = {
    green: "from-[#00ff88]/20 to-[#00ff88]/5 border-[#00ff88]/20 text-[#00ff88]",
    cyan: "from-[#00d4ff]/20 to-[#00d4ff]/5 border-[#00d4ff]/20 text-[#00d4ff]",
    purple: "from-[#a855f7]/20 to-[#a855f7]/5 border-[#a855f7]/20 text-[#a855f7]",
    pink: "from-[#ec4899]/20 to-[#ec4899]/5 border-[#ec4899]/20 text-[#ec4899]",
  };

  return (
    <div className={`bg-gradient-to-b ${colors[color as keyof typeof colors]} rounded-xl p-4 border`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <div
      className="group glass-card rounded-2xl p-8 border border-white/5 hover:border-[#00ff88]/30 transition-all duration-500"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 border border-[#00ff88]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <span className="text-2xl">{feature.icon}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
      <p className="text-gray-500 leading-relaxed">{feature.description}</p>
    </div>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  const colors = {
    green: "bg-[#00ff88]",
    cyan: "bg-[#00d4ff]",
    purple: "bg-[#a855f7]",
    pink: "bg-[#ec4899]",
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full ${colors[color as keyof typeof colors]} rounded-full`} style={{ width: "95%" }} />
        </div>
        <span className="text-white font-semibold min-w-[80px] text-right">{value}</span>
      </div>
    </div>
  );
}

const features = [
  {
    icon: "🔍",
    title: "Vulnerability Scanning",
    description: "Automated scanning that discovers security weaknesses before attackers do.",
  },
  {
    icon: "🛡️",
    title: "VAPT Management",
    description: "Comprehensive penetration testing workflow with detailed reporting.",
  },
  {
    icon: "☁️",
    title: "Cloud Security",
    description: "Protect your cloud infrastructure across AWS, Azure, and GCP.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Analysis",
    description: "Machine learning algorithms that identify patterns and predict threats.",
  },
  {
    icon: "📊",
    title: "Real-time Dashboard",
    description: "Live monitoring with beautiful visualizations and instant alerts.",
  },
  {
    icon: "🔐",
    title: "Compliance Ready",
    description: "Built-in compliance frameworks for SOC 2, ISO 27001, and more.",
  },
];

const benefits = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Sub-50ms response times with our globally distributed infrastructure.",
  },
  {
    icon: "🔒",
    title: "Bank-Grade Security",
    description: "256-bit encryption with zero-knowledge architecture.",
  },
  {
    icon: "🌍",
    title: "Global Scale",
    description: "Deploy anywhere with our multi-region cloud infrastructure.",
  },
  {
    icon: "🤝",
    title: "Expert Support",
    description: "24/7 access to security experts and dedicated success managers.",
  },
];
