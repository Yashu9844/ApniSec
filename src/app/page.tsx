"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#030303] cyber-grid overflow-hidden">
      <Navbar />
      
      {/* Floating Orbs Background - Brighter */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main bright green glow - top left */}
        <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-[#00ff88]/30 rounded-full blur-[100px] animate-pulse-glow" />
        {/* Cyan glow - right side */}
        <div className="absolute top-1/3 -right-20 w-[700px] h-[700px] bg-[#00d4ff]/25 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        {/* Purple glow - bottom center */}
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-[#a855f7]/25 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        {/* Additional smaller accent glows */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#00ff88]/20 rounded-full blur-[60px] animate-float" />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#00d4ff]/20 rounded-full blur-[50px] animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Geometric Shapes Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Rotating squares */}
        <div className="absolute top-32 left-[10%] w-32 h-32 border border-[#00ff88]/30 rotate-45 animate-spin-slow" />
        <div className="absolute top-48 left-[15%] w-20 h-20 border border-[#00d4ff]/25 rotate-12 animate-spin-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-64 right-[10%] w-24 h-24 border border-[#a855f7]/25 -rotate-12 animate-spin-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-48 right-[20%] w-28 h-28 border border-[#00ff88]/20 rotate-45 animate-spin-slow" style={{ animationDelay: "3s" }} />
        {/* Circles */}
        <div className="absolute top-40 right-[30%] w-16 h-16 border-2 border-[#00ff88]/40 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-[25%] w-12 h-12 border-2 border-[#00d4ff]/35 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
        {/* Dots pattern */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-[#00ff88]/60 rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#00d4ff]/60 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-[#a855f7]/60 rounded-full animate-ping" style={{ animationDelay: "2s" }} />
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
            <span className="text-sm text-gray-300">Trusted by 100+ Organizations</span>
          </div>

          {/* Main Heading - Updated to match ApniSec.com */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.9] tracking-tight animate-fade-in-up">
            <span className="block text-white">Defend Against</span>
            <span className="block text-white">Cyber Threats</span>
            <span className="block neon-green">Before They Strike</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-400 mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Elevate Your Security Posture With Advanced Security Solutions And In-Depth
            Vulnerability Assessments, Aligned With OWASP, NIST, SANS, CERT, And NIC Frameworks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link href="/register">
              <Button variant="primary" size="lg">
                Get Started Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Book a Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - Certification Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CertBadge text="SOC 2" />
            <CertBadge text="ISO 27001" />
            <CertBadge text="GDPR" />
            <CertBadge text="OWASP" />
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
                    <StatCard value="849M+" label="Lines of Code Reviewed" color="green" />
                    <StatCard value="3Bn+" label="Records Scraped" color="cyan" />
                    <StatCard value="15K+" label="Assets Monitored" color="purple" />
                    <StatCard value="99.99%" label="Threat Mitigation" color="pink" />
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

      {/* How We Do It - Process Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#a855f7] text-xs font-semibold uppercase tracking-wider mb-6">
              Our Process
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">How </span>
              <span className="neon-green">We Do It</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg">
              A proven 5-step approach to securing your digital infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <ProcessCard key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why ApniSec Section */}
      <section id="about" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-xs font-semibold uppercase tracking-wider mb-6">
              Our Mission
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">To Make Digital Space </span>
              <span className="neon-cyan">A Safer Place</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Why Choose ApniSec?</h3>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="glass-card rounded-xl p-6 border border-white/5 hover:border-[#00ff88]/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 border border-[#00ff88]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-xl">{benefit.icon}</span>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-gray-500 text-sm">{benefit.description}</p>
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
                  <MetricRow label="Average Response Time" value="< 5 min" color="cyan" />
                  <MetricRow label="False Positive Rate" value="0.003%" color="purple" />
                  <MetricRow label="Uptime SLA" value="99.99%" color="pink" />
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Trusted by</p>
                      <p className="text-white font-bold text-2xl">100+ Companies</p>
                    </div>
                    <div className="flex -space-x-2">
                      {['E', 'F', 'H', 'L', 'O'].map((letter, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#0a0a0a] flex items-center justify-center text-xs text-gray-400 font-bold"
                        >
                          {letter}
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
                  <span className="text-white">Protect Your </span>
                  <span className="text-gradient">Data Now</span>
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
                      Book a Call
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#a855f7] text-xs font-semibold uppercase tracking-wider mb-6">
              Testimonials
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Our Secured </span>
              <span className="neon-cyan">Clients Say It All</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg">
              Retained 100% customers since inception from various industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-xs font-semibold uppercase tracking-wider mb-6">
              FAQ
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Frequently Asked </span>
              <span className="neon-green">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem 
                key={index} 
                faq={faq} 
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CertBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
      <svg className="w-4 h-4 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <span className="text-gray-400 text-sm font-medium">{text}</span>
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

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="glass-card rounded-2xl p-8 border border-white/5 hover:border-[#a855f7]/30 transition-all">
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-400 mb-6 leading-relaxed">&quot;{testimonial.text}&quot;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center text-black font-bold">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="text-white font-semibold">{testimonial.name}</p>
          <p className="text-gray-500 text-sm">{testimonial.role} at {testimonial.company}</p>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-medium">{faq.question}</span>
        <svg
          className={`w-5 h-5 text-[#00ff88] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

function ProcessCard({ step, index }: { step: typeof processSteps[0]; index: number }) {
  return (
    <div className="relative group">
      {/* Connector Line */}
      {index < 4 && (
        <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#00ff88]/50 to-transparent z-0" />
      )}
      
      <div className="relative glass-card rounded-2xl p-6 border border-white/5 hover:border-[#00ff88]/30 transition-all text-center h-full">
        {/* Step Number */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#00ff88] text-black text-xs font-bold flex items-center justify-center">
          {index + 1}
        </div>
        
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 border border-[#00ff88]/20 flex items-center justify-center mb-4 mt-2 group-hover:scale-110 transition-transform">
          <span className="text-2xl">{step.icon}</span>
        </div>
        <h3 className="text-white font-bold mb-2">{step.title}</h3>
        <p className="text-gray-500 text-sm">{step.description}</p>
      </div>
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
    icon: "�️",
    title: "Dark Eye Watcher",
    description: "Monitor the Dark Web for compromised data, track data breaches 24x7, and protect your brand.",
  },
  {
    icon: "☁️",
    title: "Cloud Security",
    description: "Cloud Security Posture Management, microservices security, and cloud attack emulation.",
  },
  {
    icon: "🎯",
    title: "Red Team Assessment",
    description: "Social engineering simulations, vulnerability assessments, and on-site network audits.",
  },
  {
    icon: "🔍",
    title: "End-to-End VAPT",
    description: "Web, API & Mobile security testing, secure code review, and penetration testing.",
  },
  {
    icon: "👨‍💼",
    title: "Virtual CISO",
    description: "Continuous vulnerability scanning, DevSecOps culture, and security policy management.",
  },
  {
    icon: "✅",
    title: "Compliance Services",
    description: "ISO 27001, SOC2, GDPR, RBI audits and compliance with third-party risk assessment.",
  },
];

const benefits = [
  {
    icon: "🔒",
    title: "Data Loss Prevention",
    description: "Protect sensitive data from unauthorized access and leakage.",
  },
  {
    icon: "👁️",
    title: "Third Party Monitoring",
    description: "Continuous monitoring of vendors and partners for security risks.",
  },
  {
    icon: "📋",
    title: "Compliance Ready",
    description: "Stay compliant with industry regulations and standards.",
  },
  {
    icon: "💰",
    title: "Financial Loss Prevention",
    description: "Prevent costly breaches and cyber attacks before they happen.",
  },
];

const testimonials = [
  {
    name: "Moiz Arsiwala",
    role: "Co-founder",
    company: "WorkIndia",
    text: "Working with ApniSec has been a game-changer for our organization. Their penetration testing services provided us with critical insights into our vulnerabilities.",
  },
  {
    name: "Praveen Kumar",
    role: "CTO",
    company: "Livspace",
    text: "ApniSec is proactive, skilled, and vigilant, anticipating and mitigating risks to protect the organization. They communicate effectively and stay innovative.",
  },
  {
    name: "Sourav Pathak",
    role: "Principal Engineer",
    company: "OZiva",
    text: "Our partnership with ApniSec has been an absolute game-changer. Their proactive approach keeps us a step ahead of potential threats.",
  },
];

const faqs = [
  {
    question: "How often are security alerts generated?",
    answer: "Alerts are generated in real-time based on specific conditions or triggers. Our system monitors 24/7 and notifies you immediately when threats are detected.",
  },
  {
    question: "What is the average response time?",
    answer: "Our average response time is under 5 minutes for critical threats. Our security team is available 24/7 to address any security concerns.",
  },
  {
    question: "Can I customize the security alerts?",
    answer: "Yes, you can fully customize alerts based on your preferences, severity levels, and specific security configurations for your organization.",
  },
  {
    question: "What platforms are supported?",
    answer: "Our service supports all major platforms including Windows, macOS, Linux, and mobile platforms like iOS and Android. We also support cloud environments.",
  },
  {
    question: "Is there a trial period available?",
    answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card required to get started.",
  },
];

const processSteps = [
  {
    icon: "📋",
    title: "Identify Critical Assets",
    description: "Primary customer and internet facing applications",
  },
  {
    icon: "🔍",
    title: "Vulnerability Assessment",
    description: "Security testing by expert team of certified hackers",
  },
  {
    icon: "👁️",
    title: "Watcher Onboarding",
    description: "Asset monitoring, SCM, Dark Eye Watcher for overall monitoring",
  },
  {
    icon: "👨‍💼",
    title: "vCISO Support",
    description: "Regular threat modelling and architecture & code reviews",
  },
  {
    icon: "📊",
    title: "Reporting & Mitigation",
    description: "Regular reporting, patching, re-testing with PR reviews",
  },
];
