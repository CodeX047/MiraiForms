"use client";

import React, { useState, useEffect } from "react";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Field, FieldLabel } from "~/components/ui/field";
import { toast } from "sonner";

export default function LoginPage() {
  const { signIn, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // If already signed in, redirect to dashboard
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    if (!email || !password) {
      setAuthError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const { error } = await signIn.password({
        identifier: email,
        password,
      });

      if (error) {
        const message = error.longMessage || error.message || "Invalid credentials.";
        setAuthError(message);
        toast.error("Sign-in failed", {
          description: message,
        });
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/dashboard");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
        toast.success("Welcome back!", {
          description: "Signed in successfully.",
        });
      } else {
        console.warn("Sign in status unresolved:", signIn.status);
        setAuthError(`Authentication status unresolved: ${signIn.status}`);
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      const message = err.message || "An unexpected error occurred.";
      setAuthError(message);
      toast.error("Sign-in failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!signIn) return;

    setGoogleLoading(true);
    setAuthError(null);

    try {
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });

      if (error) {
        const message = error.longMessage || error.message || "Google sign-in initiation failed.";
        setAuthError(message);
        toast.error("Google sign-in failed", {
          description: message,
        });
        setGoogleLoading(false);
      }
    } catch (err: any) {
      console.error("Google authentication trigger error:", err);
      const message = err.message || "Could not initiate Google login.";
      setAuthError(message);
      toast.error("Google sign-in failed", {
        description: message,
      });
      setGoogleLoading(false);
    }
  };

  const isFormLoading = isLoading || googleLoading || fetchStatus === "fetching";

  return (
    <div className="dark min-h-screen w-full bg-[#030712] flex items-center justify-center p-6 md:p-10 text-slate-100 overflow-hidden relative">
      {/* Background neon ambient gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-pink-500/5 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <div className="flex items-center justify-center h-full w-full rounded-xl bg-slate-950">
              <svg
                className="h-6 w-6 text-indigo-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-wider mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            MIRAI FORMS
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
            Next-Gen Form Engine
          </p>
        </div>

        {/* Card Component */}
        <Card className="border border-white/[0.08] bg-slate-950/45 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 hover:border-white/[0.12]">
          <CardContent className="p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Welcome back
              </h2>
              <p className="text-sm text-slate-400">
                Log in to manage and build beautiful interactive forms.
              </p>
            </div>

            {/* Google OAuth Login Button */}
            <Button
              type="button"
              variant="outline"
              disabled={isFormLoading}
              onClick={handleGoogleLogin}
              className="w-full h-11 bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] text-slate-200 flex items-center justify-center gap-3 transition-all duration-300 rounded-xl font-medium shadow-xs hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] active:scale-[0.99]"
            >
              {googleLoading ? (
                <div className="h-4 w-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            {/* Separator */}
            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/[0.08]" />
              </div>
              <span className="relative bg-[#0b0f19] px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                or email
              </span>
            </div>

            {/* Custom Error Banner */}
            {authError && (
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200">
                <svg
                  className="h-5 w-5 shrink-0 text-red-400/90 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            {/* Login Credentials Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field>
                <FieldLabel className="text-slate-300 text-xs font-semibold tracking-wide uppercase">
                  Email Address
                </FieldLabel>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  disabled={isFormLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/[0.02] border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/10 text-slate-100 placeholder-slate-500 rounded-xl h-11 transition-all duration-300 px-3.5"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-slate-300 text-xs font-semibold tracking-wide uppercase">
                    Password
                  </FieldLabel>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isFormLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/[0.02] border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/10 text-slate-100 placeholder-slate-500 rounded-xl h-11 transition-all duration-300 px-3.5"
                />
              </Field>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isFormLoading}
                className="w-full h-11 mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:opacity-95 shadow-[0_0_25px_rgba(99,102,241,0.2)] active:scale-[0.98] duration-200 rounded-xl flex items-center justify-center gap-2 border-0"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Form Footer */}
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-indigo-400 font-semibold hover:text-indigo-300 underline underline-offset-4 decoration-indigo-400/30 hover:decoration-indigo-300 transition-all duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
