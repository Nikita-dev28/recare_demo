"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "./components/common/Input";
import { loginApi } from "../services/APIClient";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginApi(data);

      if (response?.message === "Login successful") {
        console.log(response);
        dispatch(
          setAuth({ token: response.user.token, name: response.user.name })
        );

        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-emerald-500 to-indigo-500 bg-clip-text text-transparent">
          Login
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          autoComplete="off"
          spellCheck={false}
        >
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            registerOptions={{ required: "Email is required" }}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            register={register}
            registerOptions={{ required: "Password is required" }}
            autoComplete="new-password"
            error={errors.password?.message}
          />

          <div className="flex justify-center mt-9">
            <button
              disabled={isSubmitting}
              className="w-[140px] bg-emerald-300 text-black font-bold py-2 rounded-md hover:bg-emerald-400 transition disabled:bg-emerald-200"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
