"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles } from "lucide-react";

export function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@careguide.bd",
      password: "DoctorTracker2024!",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Authentication failed. Please verify credentials."
      );
    }
  };

  const fillDemoCredentials = () => {
    setValue("email", "admin@careguide.bd", { shouldValidate: true });
    setValue("password", "DoctorTracker2024!", { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email-input"
          className="block text-xs font-semibold text-slate-700"
        >
          Work Email Address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Mail className="h-4 w-4" />
          </div>
          <Input
            id="email-input"
            type="email"
            placeholder="admin@careguide.bd"
            className="pl-9 h-10 text-sm bg-white"
            autoComplete="email"
            error={!!errors.email}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-[11px] font-medium text-destructive mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password-input"
            className="block text-xs font-semibold text-slate-700"
          >
            Password
          </label>
          <span className="text-[11px] text-muted-foreground">Demo Protected</span>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Lock className="h-4 w-4" />
          </div>
          <Input
            id="password-input"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            className="pl-9 pr-10 h-10 text-sm bg-white"
            autoComplete="current-password"
            error={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">Toggle password visibility</span>
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] font-medium text-destructive mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-10 font-semibold shadow-md shadow-primary/20"
        isLoading={isSubmitting}
      >
        Sign In to Portal
      </Button>

      {/* Quick Demo Fill */}
      <div className="pt-2">
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="w-full py-2 px-3 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-medium"
        >
          <Sparkles className="h-3.5 w-3.5 text-sky-600" />
          Prefill Demo Admin Credentials
        </button>
      </div>
    </form>
  );
}

