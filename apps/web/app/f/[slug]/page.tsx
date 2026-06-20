"use client";

import React, { useEffect, useCallback, useReducer, useRef, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Info,
  Terminal,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";

import { useGetPublicForm, useSubmitForm } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Field, FieldLabel, FieldDescription, FieldError } from "~/components/ui/field";
import { trpc } from "~/trpc/client";

type ResponsesState = Record<string, string>;

const LOADING_TIMEOUT_MS = 15_000;

type State = {
  hasTimedOut: boolean;
  responses: ResponsesState;
  validationErrors: Record<string, string>;
  isSubmitted: boolean;
};

type Action =
  | { type: "TIMEOUT" }
  | { type: "RETRY" }
  | { type: "SET_FIELD"; fieldId: string; value: string }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "SUBMIT_SUCCESS" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TIMEOUT":
      return { ...state, hasTimedOut: true };
    case "RETRY":
      return { ...state, hasTimedOut: false };
    case "SET_FIELD": {
      const newErrors = { ...state.validationErrors };
      delete newErrors[action.fieldId];
      return {
        ...state,
        responses: { ...state.responses, [action.fieldId]: action.value },
        validationErrors: newErrors,
      };
    }
    case "SET_ERRORS":
      return { ...state, validationErrors: action.errors };
    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitted: true };
    default:
      return state;
  }
}

export default function PublicFormPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] flex items-center justify-center relative overflow-hidden">
          <RefreshCw className="h-6 w-6 animate-spin text-[#E94B35]" />
        </div>
      }
    >
      <PublicFormContent />
    </Suspense>
  );
}

function PublicFormContent() {
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const { form, isLoading, error, status } = useGetPublicForm(slug, isPreview, true);
  const { submitFormAsync, status: submitStatus } = useSubmitForm();
  const utils = trpc.useUtils();

  const [state, dispatch] = useReducer(reducer, {
    hasTimedOut: false,
    responses: {},
    validationErrors: {},
    isSubmitted: false,
  });

  const startTime = useRef<number>(Date.now());
  const retryCount = useRef(0);

  useEffect(() => {
    if (!isLoading) {
      if (state.hasTimedOut) dispatch({ type: "RETRY" });
      return;
    }
    const timer = setTimeout(() => {
      dispatch({ type: "TIMEOUT" });
    }, LOADING_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoading, state.hasTimedOut]);

  const handleRetry = useCallback(() => {
    dispatch({ type: "RETRY" });
    retryCount.current += 1;
    void utils.form.getPublicForm.invalidate({ slug, preview: isPreview });
  }, [utils, slug, isPreview]);

  const alreadySubmitted =
    typeof window !== "undefined" && form?.id
      ? localStorage.getItem(`submitted_${form.id}`) === "true"
      : false;

  const isSubmitting = submitStatus === "pending";

  const handleChange = (fieldId: string, value: string) => {
    dispatch({ type: "SET_FIELD", fieldId, value });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!form || !form.fields) return false;

    for (const field of form.fields) {
      const val = state.responses[field.id] ?? (field.type === "YES_NO" ? "false" : "");
      if (field.isRequired) {
        if (!val || val.trim() === "") {
          errors[field.id] = "This field is required.";
          isValid = false;
        }
      }

      if (field.type === "EMAIL" && val && val.trim() !== "") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errors[field.id] = "Please enter a valid email address.";
          isValid = false;
        }
      }

      if (field.type === "NUMBER" && val && val.trim() !== "") {
        if (isNaN(Number(val))) {
          errors[field.id] = "Please enter a valid number.";
          isValid = false;
        }
      }
    }

    dispatch({ type: "SET_ERRORS", errors });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!validateForm()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    if (isPreview) {
      dispatch({ type: "SUBMIT_SUCCESS" });
      toast.success("SIMULATED_TRANSMISSION_SUCCESS", {
        description: "Preview submission successful (data not saved).",
        className: "mono uppercase text-xs border border-[#22c55e] bg-[#0D0D0D] text-white rounded",
      });
      return;
    }

    const responsePayload = form.fields.map((field) => ({
      formFieldId: field.id,
      value: state.responses[field.id] ?? (field.type === "YES_NO" ? "false" : ""),
    }));

    try {
      await submitFormAsync({
        formId: form.id,
        responses: responsePayload,
        metadata: {
          userAgent: window.navigator.userAgent,
          completionTime: Math.round((Date.now() - startTime.current) / 1000),
        },
      });

      dispatch({ type: "SUBMIT_SUCCESS" });
      if (form?.id) {
        localStorage.setItem(`submitted_${form.id}`, "true");
      }
      toast.success("Response submitted successfully!");
    } catch (err: any) {
      toast.error("Failed to submit form", {
        description: err?.message || "Something went wrong.",
      });
    }
  };

  // --- Loading / Timeout / Error guard ---
  if (isLoading && !state.hasTimedOut && !error) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
        <div className="flex flex-col items-center gap-4 text-white relative z-10">
          <RefreshCw className="h-6 w-6 animate-spin text-[#E94B35]" />
          <p className="mono text-xs text-[#6E6E6E] uppercase tracking-widest">
            ESTABLISHING_LINK...
          </p>
        </div>
      </div>
    );
  }

  // Timeout or error during loading — show recovery UI
  if ((state.hasTimedOut && isLoading) || (status === "error" && !form)) {
    const isTimeout = state.hasTimedOut && isLoading;
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#E94B35] selection:text-white">
        <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
        <div className="absolute inset-0 opacity-3 pointer-events-none scanlines z-0" />

        <div className="max-w-md w-full border border-[#E94B35]/30 bg-[#0D0D0D] p-8 text-center shadow-[0_0_40px_rgba(233,75,53,0.1)] relative z-10 rounded">
          <div className="mx-auto mb-5 rounded-full bg-[#E94B35]/10 w-14 h-14 flex items-center justify-center text-[#E94B35] border border-[#E94B35]/20">
            <WifiOff className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white mono mb-2 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(233,75,53,0.3)]">
            {isTimeout ? "LINK_SIGNAL_LOST" : "CONNECTION_FAILED"}
          </h2>
          <p className="text-xs text-[#6E6E6E] mono uppercase tracking-wider mb-6 leading-relaxed">
            {isTimeout
              ? "Unable to establish form connection. The server may be waking up from idle."
              : "Failed to load the form. Please check your connection and try again."}
          </p>
          <div className="h-px bg-white/10 w-full mb-6" />
          <Button
            onClick={handleRetry}
            className="bg-[#E94B35] text-white hover:bg-[#FF3B30] transition-all text-xs uppercase font-bold mono rounded cursor-pointer h-10 px-6 shadow-[0_0_20px_rgba(233,75,53,0.15)] hover:shadow-[0_0_30px_rgba(233,75,53,0.3)] flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            RETRY_CONNECTION
          </Button>
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <span className="text-[10px] mono text-[#6E6E6E]/60 uppercase">SIGNAL:</span>
            <span className="text-[10px] mono text-[#E94B35] font-bold uppercase animate-ping mr-1">
              ●
            </span>
            <span className="text-[10px] mono text-[#E94B35] font-bold uppercase">NO_SIGNAL</span>
          </div>
        </div>
      </div>
    );
  }

  if (alreadySubmitted && !isPreview) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#E94B35] selection:text-white">
        {/* Subtle scanline and grid background overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
        <div className="absolute inset-0 opacity-3 pointer-events-none scanlines z-0" />

        <div className="relative z-10 w-full max-w-md border border-[#E94B35]/30 bg-[#0D0D0D] p-8 text-center rounded shadow-[0_0_50px_rgba(233,75,53,0.15)] select-none">
          <div className="mx-auto mb-6 rounded bg-[#E94B35]/10 p-4 text-[#E94B35] border border-[#E94B35]/20 w-fit animate-pulse">
            <Terminal className="h-8 w-8" />
          </div>
          <h2 className="heading-brutalist text-2xl font-bold mono text-center uppercase tracking-widest text-[#E94B35] mb-2">
            BROADCAST_COMPLETED
          </h2>
          <div className="h-px bg-linear-to-r from-transparent via-[#E94B35]/30 to-transparent w-full my-4" />
          <p className="text-xs mono text-[#6E6E6E] uppercase tracking-wide leading-relaxed mb-6">
            Your telemetry signal has already been successfully recorded in the centralized
            databases. Duplicate entries are blocked to prevent data contamination.
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[9px] mono text-[#E94B35] uppercase font-bold bg-[#E94B35]/5 border border-[#E94B35]/20 rounded py-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E94B35] animate-ping" />
            <span>CONNECTION_SAFE / SINGLE_TRANSMISSION_ONLY</span>
          </div>
        </div>
      </div>
    );
  }

  // Render branded offline gate if unpublished/not found (throws TRPCError(NOT_FOUND))
  if (error || !form || (!form.published && !isPreview)) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#E94B35] selection:text-white">
        {/* Subtle scanline and grid background overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
        <div className="absolute inset-0 opacity-3 pointer-events-none scanlines z-0" />

        <div className="max-w-md w-full border border-[#E94B35]/30 bg-[#0D0D0D] p-8 text-center shadow-[0_0_40px_rgba(233,75,53,0.1)] relative z-10 rounded">
          <div className="mx-auto mb-5 rounded-full bg-[#E94B35]/10 w-14 h-14 flex items-center justify-center text-[#E94B35] border border-[#E94B35]/20 animate-pulse">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white mono mb-2 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(233,75,53,0.3)]">
            FORM UNAVAILABLE
          </h2>
          <p className="text-xs text-[#6E6E6E] mono uppercase tracking-wider mb-6">
            This transmission is currently offline.
          </p>
          <div className="h-px bg-white/10 w-full mb-6" />
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[10px] mono text-[#6E6E6E]/60 uppercase">SIGNAL:</span>
            <span className="text-[10px] mono text-[#E94B35] font-bold uppercase animate-ping mr-1">
              ●
            </span>
            <span className="text-[10px] mono text-[#E94B35] font-bold uppercase">NO_SIGNAL</span>
          </div>
        </div>
      </div>
    );
  }

  if (state.isSubmitted) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#E94B35] selection:text-white">
        <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
        <div className="absolute inset-0 opacity-3 pointer-events-none scanlines z-0" />
        <div className="max-w-md w-full relative z-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto mb-6 rounded bg-[#22c55e]/10 w-20 h-20 flex items-center justify-center text-[#22c55e] border border-[#22c55e]/20 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="heading-brutalist text-4xl text-white mb-4">TRANSMISSION_COMPLETE</h1>
          <p className="text-xs text-[#6E6E6E] mono max-w-sm mx-auto uppercase">
            Your response for <strong className="text-white">"{form.title}"</strong> has been
            successfully broadcasted.
          </p>
          <div className="mt-12 flex items-center justify-center gap-2 opacity-50">
            <span className="text-[10px] mono text-[#6E6E6E] uppercase tracking-widest">
              Powered by
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase mono text-white">
              Mirai<span className="text-[#E94B35]">Forms</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#080808] relative overflow-hidden selection:bg-[#E94B35] selection:text-white pb-20"
      suppressHydrationWarning
    >
      <div className="fixed inset-0 opacity-5 pointer-events-none grid-lines z-0" />
      <div className=" inset-0 opacity-3 pointer-events-none scanlines z-0 fixed" />

      {isPreview && (
        <div className="bg-[#E94B35] text-white py-2 px-4 text-center text-xs font-bold uppercase tracking-widest mono sticky top-0 z-50 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(233,75,53,0.3)] border-b border-[#FF3B30]">
          <Info className="h-4 w-4 animate-pulse shrink-0" />
          <span>DRAFT_PREVIEW: Submissions are simulated for testing.</span>
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky ${isPreview ? "top-8" : "top-0"} z-40 border-b border-white/10 bg-[#080808]/80 backdrop-blur-md transition-all`}
      >
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest uppercase mono text-white">
              Mirai<span className="text-[#E94B35]">Forms</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Form Title & Description */}
        <div className="mb-12">
          <h1 className="heading-brutalist text-5xl text-white mb-4">{form.title}</h1>
          {form.description && (
            <p className="text-sm mono text-[#A0A0A0] leading-relaxed border-l-2 border-[#E94B35] pl-4">
              {form.description}
            </p>
          )}
        </div>

        {/* Form Body */}
        {!form.fields || form.fields.length === 0 ? (
          <div className="rounded border border-white/10 bg-[#0D0D0D] p-8 text-center shadow-2xl">
            <Info className="h-6 w-6 text-[#6E6E6E] mx-auto mb-3" />
            <p className="text-xs text-[#6E6E6E] mono">
              This form currently has no fields to fill out.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {form.fields.map((field, idx) => {
                const val = state.responses[field.id] ?? (field.type === "YES_NO" ? "false" : "");
                const errorMsg = state.validationErrors[field.id];

                return (
                  <div
                    key={field.id}
                    className="rounded border border-white/10 bg-[#0D0D0D]/50 p-6 shadow-xl hover:border-white/20 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]"
                  >
                    <Field data-invalid={!!errorMsg || undefined}>
                      <FieldLabel className="text-white text-sm font-semibold tracking-wide uppercase mono flex items-center gap-2">
                        <span className="text-[#E94B35]">{String(idx + 1).padStart(2, "0")}.</span>
                        {field.label}
                        {field.isRequired && (
                          <span className="text-[#E94B35] text-lg leading-none">*</span>
                        )}
                      </FieldLabel>

                      {field.description && (
                        <FieldDescription className="text-xs text-[#6E6E6E] mono mt-1.5 mb-4 block">
                          {field.description}
                        </FieldDescription>
                      )}

                      <div className="mt-3">
                        {/* TEXT / EMAIL / NUMBER / PASSWORD */}
                        {(field.type === "TEXT" ||
                          field.type === "EMAIL" ||
                          field.type === "NUMBER" ||
                          field.type === "PASSWORD") && (
                          <Input
                            type={field.type.toLowerCase()}
                            placeholder={field.placeholder || "Your answer..."}
                            value={val}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            disabled={isSubmitting}
                            className="bg-[#080808] border-white/10 text-white placeholder-[#404040] focus:border-[#E94B35]/50 focus:ring-1 focus:ring-[#E94B35]/30 rounded text-sm px-4 py-3 h-auto mono"
                          />
                        )}

                        {/* SELECT */}
                        {field.type === "SELECT" && (
                          <Select
                            value={val}
                            onValueChange={(v) => handleChange(field.id, v)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className="bg-[#080808] border-white/10 text-white focus:border-[#E94B35]/50 rounded text-sm h-12 mono">
                              <SelectValue
                                placeholder={field.placeholder || "Select an option..."}
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0D0D0D] border-white/10">
                              {field.choices && field.choices.length > 0 ? (
                                field.choices.map((choice) => (
                                  <SelectItem
                                    key={choice}
                                    value={choice}
                                    className="text-white text-xs hover:bg-white/5 focus:bg-white/5 cursor-pointer mono"
                                  >
                                    {choice}
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem
                                    value="Option A"
                                    className="text-white text-xs hover:bg-white/5 focus:bg-white/5 cursor-pointer mono"
                                  >
                                    Option A
                                  </SelectItem>
                                  <SelectItem
                                    value="Option B"
                                    className="text-white text-xs hover:bg-white/5 focus:bg-white/5 cursor-pointer mono"
                                  >
                                    Option B
                                  </SelectItem>
                                  <SelectItem
                                    value="Option C"
                                    className="text-white text-xs hover:bg-white/5 focus:bg-white/5 cursor-pointer mono"
                                  >
                                    Option C
                                  </SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        )}

                        {/* YES_NO (Switch) */}
                        {field.type === "YES_NO" && (
                          <div className="flex items-center gap-3 py-1">
                            <Switch
                              checked={val === "true"}
                              onCheckedChange={(c) => handleChange(field.id, c ? "true" : "false")}
                              disabled={isSubmitting}
                              className="data-[state=checked]:bg-[#22c55e]"
                            />
                            <span className="text-sm mono text-white">
                              {val === "true" ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                      </div>

                      {errorMsg && (
                        <FieldError className="text-xs text-[#E94B35] mono mt-2 block font-semibold">
                          {errorMsg}
                        </FieldError>
                      )}
                    </Field>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#E94B35] text-white hover:bg-[#FF3B30] transition-all text-sm uppercase font-bold mono rounded cursor-pointer h-12 px-8 shadow-[0_0_20px_rgba(233,75,53,0.15)] hover:shadow-[0_0_30px_rgba(233,75,53,0.3)] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    SUBMIT RESPONSE
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
