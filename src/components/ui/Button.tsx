"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2
    font-semibold tracking-wide
    transition-all duration-300 ease-out
    transform active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black
    overflow-hidden
  `;

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl",
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#00ff88]
      bg-[length:200%_100%] animate-gradient-x
      text-black font-bold
      hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]
      focus-visible:ring-[#00ff88]
      before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%]
      hover:before:translate-x-[100%] before:transition-transform before:duration-500
    `,
    secondary: `
      bg-[#111] border border-[#00ff88]/30
      text-[#00ff88]
      hover:bg-[#00ff88]/10 hover:border-[#00ff88]/60
      hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]
      focus-visible:ring-[#00ff88]
    `,
    outline: `
      bg-transparent border-2 border-[#00d4ff]/50
      text-[#00d4ff]
      hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]
      hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]
      focus-visible:ring-[#00d4ff]
    `,
    ghost: `
      bg-transparent
      text-gray-300
      hover:bg-white/5 hover:text-white
      focus-visible:ring-white/50
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-500
      text-white font-bold
      hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]
      focus-visible:ring-red-500
    `,
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
