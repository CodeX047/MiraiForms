"use client";

import React, { useState, useEffect } from "react";
import { useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Field, FieldLabel } from "~/components/ui/field";
import { toast } from "sonner";

export default function SignupPage() {
  const { signUp, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // If already signed in, redirect to dashboard
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    if (!email || !password) {
      setAuthError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setAuthError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      // 1. Create signup attempt with email and password
      const { error: signUpError } = await signUp.password({
        emailAddress: email,
        password,
      });

      if (signUpError) {
        const message = signUpError.longMessage || signUpError.message || "Signup failed.";
        setAuthError(message);
        toast.error("Signup failed", {
          description: message,
        });
        return;
      }

      // 2. Prepare verification code sending (triggers the email)
      const { error: sendCodeError } = await signUp.verifications.sendEmailCode();

      if (sendCodeError) {
        const message = sendCodeError.longMessage || sendCodeError.message || "Verification code failed to send.";
        setAuthError(message);
        toast.error("Verification code error", {
          description: message,
        });
        return;
      }

      // 3. Set verified stage to true to show the OTP screen
      setVerifying(true);
      toast.success("Verification code sent!", {
        description: "Check your email inbox for a 6-digit code.",
      });
    } catch (err: any) {
      console.error("Sign up creation error:", err);
      const message = err.message || "An unexpected error occurred.";
      setAuthError(message);
      toast.error("Signup failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    if (!code) {
      setAuthError("Please enter the verification code.");
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      // 3. Attempt email address verification with entered OTP code
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (verifyError) {
        const message = verifyError.longMessage || verifyError.message || "Verification failed.";
        setAuthError(message);
        toast.error("Verification failed", {
          description: message,
        });
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/dashboard");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
        toast.success("Account created successfully!", {
          description: "Welcome to Mirai Forms.",
        });
      } else {
        console.warn("Sign up status unresolved after verification:", signUp.status);
        setAuthError(`Verification complete but status is: ${signUp.status}`);
      }
    } catch (err: any) {
      console.error("Verification code error:", err);
      const message = err.message || "An unexpected error occurred.";
      setAuthError(message);
      toast.error("Verification failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUp) return;

    try {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) {
        const message = error.longMessage || error.message || "Could not resend code.";
        setAuthError(message);
        toast.error("Resend failed", {
          description: message,
        });
        return;
      }
      toast.success("New code sent!", {
        description: "Check your email again for a new 6-digit code.",
      });
      setAuthError(null);
    } catch (err: any) {
      console.error("Resend verification code error:", err);
      const message = err.message || "Could not resend code. Please try again.";
      setAuthError(message);
      toast.error("Resend failed", {
        description: message,
      });
    }
  };

  const handleGoogleSignup = async () => {
    if (!signUp) return;

    setGoogleLoading(true);
    setAuthError(null);

    try {
      const { error } = await signUp.sso({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });

      if (error) {
        const message = error.longMessage || error.message || "Google signup initiation failed.";
        setAuthError(message);
        toast.error("Google signup failed", {
          description: message,
        });
        setGoogleLoading(false);
      }
    } catch (err: any) {
      console.error("Google authentication trigger error:", err);
      const message = err.message || "Could not initiate Google signup.";
      setAuthError(message);
      toast.error("Google signup failed", {
        description: message,
      });
      setGoogleLoading(false);
    }
  };

  const handleStartOver = () => {
    if (!signUp) return;
    signUp.reset();
    setVerifying(false);
    setAuthError(null);
    setCode("");
  };

  const isFormLoading = isLoading || googleLoading || fetchStatus === "fetching";

  return (
    <div className="dark min-h-screen w-full bg-[#080808] flex items-center justify-center p-6 md:p-10 text-[#F5F5F5] overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
      
      {/* Background neon ambient gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#E94B35]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#FF3B30]/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
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
            
            {/* Custom Error Banner */}
            {authError && (
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
                <span>{authError}</span>
              </div>
            )}

            {!verifying ? (
              /* ================== SIGN UP FORM SCREEN ================== */
              <>
                <div className="flex flex-col gap-1.5 text-center sm:text-left">
                  <h2 className="heading-brutalist text-2xl tracking-wide uppercase text-white">
                    Create account
                  </h2>
                  <p className="text-xs text-[#6E6E6E] mono">
                    / CORE_SYS_ACCESS: REGISTER TO ENTER WORKSPACE.
                  </p>
                </div>

                {/* Google OAuth Signup Button */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={isFormLoading}
                  onClick={handleGoogleSignup}
                  className="w-full h-11 bg-[#080808] border-white/10 hover:bg-[#0D0D0D] hover:border-[#E94B35]/50 text-[#F5F5F5] flex items-center justify-center gap-3 transition-all duration-300 rounded font-medium shadow-xs hover:shadow-[0_0_20px_rgba(233,75,53,0.1)] active:scale-[0.99] cursor-pointer text-xs mono uppercase tracking-wider"
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
                  Sign up with Google
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

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Field>
                    <FieldLabel className="text-white text-[10px] font-bold tracking-wide uppercase mono">
                      Email Address
                    </FieldLabel>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      disabled={isFormLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#080808] border-white/10 focus:border-[#E94B35]/50 focus:ring-transparent text-[#F5F5F5] placeholder-[#6E6E6E] rounded h-11 transition-all duration-300 px-3.5 text-xs"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-white text-[10px] font-bold tracking-wide uppercase mono">
                      Password
                    </FieldLabel>
                    <Input
                      type="password"
                      placeholder="•••••••• (Min 8 chars)"
                      disabled={isFormLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#080808] border-white/10 focus:border-[#E94B35]/50 focus:ring-transparent text-[#F5F5F5] placeholder-[#6E6E6E] rounded h-11 transition-all duration-300 px-3.5 text-xs"
                    />
                  </Field>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isFormLoading}
                    className="w-full h-11 mt-2 bg-[#E94B35] text-white font-bold hover:bg-[#FF3B30] shadow-[0_0_25px_rgba(233,75,53,0.2)] active:scale-[0.98] duration-200 rounded flex items-center justify-center gap-2 border-0 cursor-pointer text-xs uppercase mono tracking-widest"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Get Started
                        <svg
                          className="h-4 w-4"
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
              </>
            ) : (
              /* ================== OTP VERIFICATION SCREEN ================== */
              <>
                <div className="flex flex-col gap-2 text-center animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="h-10 w-10 rounded bg-[#E94B35]/10 text-[#E94B35] flex items-center justify-center mx-auto mb-2 border border-[#E94B35]/20">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
                      />
                    </svg>
                  </div>
                  <h2 className="heading-brutalist text-xl tracking-wide uppercase text-white">
                    Verify email
                  </h2>
                  <p className="text-xs text-[#6E6E6E] leading-normal px-2 mono">
                    Code sent to <span className="text-white font-bold">{email}</span>.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <Field>
                    <FieldLabel className="text-white text-[10px] font-bold tracking-wide uppercase text-center w-full block mb-1 mono">
                      Enter 6-Digit Code
                    </FieldLabel>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      disabled={isLoading}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                      className="bg-[#080808] border-white/10 focus:border-[#E94B35]/50 text-white placeholder-slate-800 rounded h-12 transition-all duration-300 text-center text-xl font-mono tracking-[0.4em] pl-4 focus:ring-transparent focus:ring-offset-transparent"
                    />
                  </Field>

                  {/* Resend Action */}
                  <div className="flex justify-between items-center px-1 text-[10px] mono">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleResendCode}
                      className="text-[#E94B35] font-semibold hover:text-[#FF3B30] transition-all cursor-pointer"
                    >
                      Resend code
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleStartOver}
                      className="text-[#6E6E6E] hover:text-[#F5F5F5] transition-all cursor-pointer"
                    >
                      Change email
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 mt-2 bg-[#E94B35] text-white font-bold hover:bg-[#FF3B30] shadow-[0_0_25px_rgba(233,75,53,0.2)] active:scale-[0.98] duration-200 rounded flex items-center justify-center gap-2 border-0 cursor-pointer text-xs uppercase mono tracking-widest"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* Captcha element required for Clerk bot sign-up protection in custom flows */}
            <div id="clerk-captcha" />
          </CardContent>
        </Card>

        {/* Form Footer */}
        <p className="text-center text-xs text-[#6E6E6E] mono">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#E94B35] font-semibold hover:text-[#FF3B30] underline underline-offset-4 decoration-[#E94B35]/30 hover:decoration-[#FF3B30] transition-all duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
