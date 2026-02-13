/* eslint-disable @typescript-eslint/no-empty-object-type */
/**
 * Styled Auth Input Component
 * 
 * Pre-styled input field for authentication forms.
 * Extends standard HTML input with consistent styling.
 */

"use client";

import { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  // No additional props needed, just extend the standard input props
}

/**
 * Styled input component for auth forms
 * Includes focus states and dark theme styling
 */
export default function AuthInput({ className = "", ...props }: AuthInputProps) {
  return (
    <input
      className={`w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600 ${className}`}
      {...props}
    />
  );
}
