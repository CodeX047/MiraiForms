import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authenticating | MiraiForms",
  description: "Completing your authentication to MiraiForms.",
};

export default function SSOCallbackPage() {
  return (
    <div className="dark min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      
      {/* Glowing Spinner */}
      <div className="z-10 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-white/5 border-t-purple-500 animate-spin" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-b-indigo-500/50 animate-pulse" />
        </div>
        <p className="text-sm font-medium tracking-wide text-slate-400 animate-pulse">
          Completing authentication...
        </p>
      </div>

      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
    </div>
  );
}
