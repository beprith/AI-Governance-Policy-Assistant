import React from "react";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
};

export default function Logo({ size = "md", className = "", onClick }: Props) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${className} relative ${onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}`}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring - represents governance framework */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="url(#gradient1)"
          strokeWidth="2"
          className="animate-pulse"
        />

        {/* Inner hexagon - represents code structure */}
        <path
          d="M32 8 L48 20 L48 44 L32 56 L16 44 L16 20 Z"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="rgba(0, 229, 255, 0.1)"
          className="animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Central diamond - represents transformation */}
        <path
          d="M32 18 L42 32 L32 46 L22 32 Z"
          fill="url(#gradient3)"
          className="animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Code brackets */}
        <path
          d="M24 24 L20 28 L20 36 L24 40"
          stroke="#00E5FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M40 24 L44 28 L44 36 L40 40"
          stroke="#00E5FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Central dot - represents precision */}
        <circle
          cx="32"
          cy="32"
          r="3"
          fill="#39FF14"
          className="animate-ping"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0A84FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39FF14" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#0A84FF" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
} 