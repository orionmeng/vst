"use client";

import { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function AuthInput({ className = "", ...props }: AuthInputProps) {
  return (
    <input
      className={`w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600 ${className}`}
      {...props}
    />
  );
}
