"use client";

import React, { useReducer } from "react";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Field, FieldLabel } from "~/components/ui/field";
import { toast } from "sonner";

type State = {
  email: string;
  password: string;
  isLoading: boolean;
  googleLoading: boolean;
  authError: string | null;
};

type Action =
  | { type: "SET_FIELD"; field: "email" | "password"; value: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_GOOGLE_LOADING"; googleLoading: boolean }
  | { type: "SET_ERROR"; error: string | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value, authError: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading, authError: null };
    case "SET_GOOGLE_LOADING":
      return { ...state, googleLoading: action.googleLoading, authError: null };
    case "SET_ERROR":
      return { ...state, authError: action.error, isLoading: false, googleLoading: false };
    default:
      return state;
  }
}

export default function LoginPage() {
  const { signIn, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, {
    email: "",
    password: "",
    isLoading: false,
    googleLoading: false,
    authError: null,
  });

  // If already signed in, redirect to dashboard
  if (isSignedIn) {
    redirect("/dashboard");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    if (!state.email || !state.password) {
      dispatch({ type: "SET_ERROR", error: "Please fill in all fields." });
      return;
    }

    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      const { error } = await signIn.password({
        identifier: state.email,
        password: state.password,
      });

      if (error) {
        const message = error.longMessage || error.message || "Invalid credentials.";
        dispatch({ type: "SET_ERROR", error: message });
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
        dispatch({ type: "SET_ERROR", error: `Authentication status unresolved: ${signIn.status}` });
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      const message = err.message || "An unexpected error occurred.";
      dispatch({ type: "SET_ERROR", error: message });
      toast.error("Sign-in failed", {
        description: message,
      });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  };

  const handleGoogleLogin = async () => {
    if (!signIn) return;

    dispatch({ type: "SET_GOOGLE_LOADING", googleLoading: true });

    try {
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });

      if (error) {
        const message = error.longMessage || error.message || "Google sign-in initiation failed.";
        dispatch({ type: "SET_ERROR", error: message });
        toast.error("Google sign-in failed", {
          description: message,
        });
      }
    } catch (err: any) {
      console.error("Google authentication trigger error:", err);
      const message = err.message || "Could not initiate Google login.";
      dispatch({ type: "SET_ERROR", error: message });
      toast.error("Google sign-in failed", {
        description: message,
      });
    }
  };

  const isFormLoading = state.isLoading || state.googleLoading || fetchStatus === "fetching";

  return (
    <div className="dark min-h-screen w-full bg-[#080808] flex items-center justify-center p-6 md:p-10 text-[#F5F5F5] overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
      
      {/* Background neon ambient gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#E94B35]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#FF3B30]/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col gap-6">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-2">
          <div className="flex items-center justify-center h-12 w-12 rounded bg-[#0D0D0D] border border-white/10 p-[1px] shadow-[0_0_20px_rgba(233,75,53,0.15)]">
            <div className="flex items-center justify-center h-full w-full rounded bg-slate-950">
              <svg
                className="h-6 w-6 text-[#E94B35]"
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
          <h1 className="text-xl font-bold tracking-wider mt-2 text-white uppercase mono">
            MIRAI<span className="text-[#E94B35]">FORMS</span>
          </h1>
          <p className="text-[10px] text-[#6E6E6E] uppercase tracking-widest font-bold mt-0.5 mono">
            / NEXT_GEN_FORM_ENGINE
          </p>
        </div>

        {/* Card Component */}
        <Card className="border border-white/10 bg-[#0D0D0D]/90 backdrop-blur-2xl rounded shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 hover:border-[#E94B35]/30">
          <CardContent className="p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <h2 className="heading-brutalist text-2xl tracking-wide uppercase text-white">
                Welcome back
              </h2>
              <p className="text-xs text-[#6E6E6E] mono">
                / CORE_SYS_ACCESS: AUTHORIZE TO ENTER WORKSPACE.
              </p>
            </div>

            {/* Google OAuth Login Button */}
            <Button
              type="button"
              variant="outline"
              disabled={isFormLoading}
              onClick={handleGoogleLogin}
              className="w-full h-11 bg-[#080808] border-white/10 hover:bg-[#0D0D0D] hover:border-[#E94B35]/50 text-[#F5F5F5] flex items-center justify-center gap-3 transition-all duration-300 rounded font-medium shadow-xs hover:shadow-[0_0_20px_rgba(233,75,53,0.1)] active:scale-[0.99] cursor-pointer text-xs mono uppercase tracking-wider"
            >
              {state.googleLoading ? (
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
                <span className="w-full border-t border-white/5" />
              </div>
              <span className="relative bg-[#0D0D0D] px-4 text-[10px] font-bold text-[#6E6E6E] uppercase tracking-widest mono">
                OR / EMAIL_AUTH
              </span>
            </div>

            {/* Custom Error Banner */}
            {state.authError && (
              <div className="p-3.5 rounded border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200 mono">
                <svg
                  className="h-4 w-4 shrink-0 text-red-400/90 mt-0.5"
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
                <span>{state.authError}</span>
              </div>
            )}

            {/* Login Credentials Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field>
                <FieldLabel className="text-white text-[10px] font-bold tracking-wide uppercase mono">
                  Email Address
                </FieldLabel>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  disabled={isFormLoading}
                  value={state.email}
                  onChange={(e) => dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })}
                  className="bg-[#080808] border-white/10 focus:border-[#E94B35]/50 focus:ring-transparent text-[#F5F5F5] placeholder-[#6E6E6E] rounded h-11 transition-all duration-300 px-3.5 text-xs"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-white text-[10px] font-bold tracking-wide uppercase mono">
                    Password
                  </FieldLabel>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isFormLoading}
                  value={state.password}
                  onChange={(e) => dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })}
                  className="bg-[#080808] border-white/10 focus:border-[#E94B35]/50 focus:ring-transparent text-[#F5F5F5] placeholder-[#6E6E6E] rounded h-11 transition-all duration-300 px-3.5 text-xs"
                />
              </Field>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isFormLoading}
                className="w-full h-11 mt-2 bg-[#E94B35] text-white font-bold hover:bg-[#FF3B30] shadow-[0_0_25px_rgba(233,75,53,0.2)] active:scale-[0.98] duration-200 rounded flex items-center justify-center gap-2 border-0 cursor-pointer text-xs uppercase mono tracking-widest"
              >
                {state.isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
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
        <p className="text-center text-xs text-[#6E6E6E] mono">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-[#E94B35] font-semibold hover:text-[#FF3B30] underline underline-offset-4 decoration-[#E94B35]/30 hover:decoration-[#FF3B30] transition-all duration-200"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
