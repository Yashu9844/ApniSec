"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../ui/Button";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/profile");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">
                Apni<span className="text-gradient">Sec</span>
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                Security Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {!isDashboard && (
              <>
                <NavLink href="/#features">Features</NavLink>
                <NavLink href="/#about">About</NavLink>
                <NavLink href="/#contact">Contact</NavLink>
              </>
            )}

            {isDashboard && (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/profile">Profile</NavLink>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isDashboard ? (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign Out
                </Button>
              </Link>
            ) : !isAuthPage ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:border-[#00ff88]/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-[#00ff88] rounded-full transform transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-[#00ff88] rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-[#00ff88] rounded-full transform transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 border-t border-white/5">
            {!isDashboard ? (
              <>
                <MobileNavLink href="/#features" onClick={() => setMobileMenuOpen(false)}>
                  Features
                </MobileNavLink>
                <MobileNavLink href="/#about" onClick={() => setMobileMenuOpen(false)}>
                  About
                </MobileNavLink>
                <MobileNavLink href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </MobileNavLink>
              </>
            )}
            
            {!isAuthPage && !isDashboard && (
              <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors group"
    >
      {children}
      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300" />
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
    >
      {children}
    </Link>
  );
}
