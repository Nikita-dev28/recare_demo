"use client";

import { UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  type?: string;
  register: UseFormRegister<any>;
  registerOptions?: object;
  error?: string;
  autoComplete?: string;
}

export default function Input({
  label,
  name,
  type = "text",
  register,
  registerOptions,
  error,
  autoComplete,
}: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...register(name, registerOptions)}
        type={type}
        autoComplete={autoComplete}
        className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
