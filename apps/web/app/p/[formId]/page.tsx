"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Info,
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

// Define response state mapped by field ID
type ResponsesState = Record<string, string>;

export default function PublicFormPage() {
  const { formId } = useParams() as { formId: string };
  const { form, isLoading, error } = useGetPublicForm(formId);
  const { submitFormAsync, status: submitStatus } = useSubmitForm();

  const [responses, setResponses] = useState<ResponsesState>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const isSubmitting = submitStatus === "pending";

  // Pre-fill default values when form loads
  useEffect(() => {
    if (form && form.fields) {
      const initial: ResponsesState = {};
      form.fields.forEach((f) => {
        if (f.type === "YES_NO") {
          initial[f.id] = "false";
        } else {
          initial[f.id] = "";
        }
      });
      setResponses(initial);
    }
  }, [form]);

  const handleChange = (fieldId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    // Clear validation error on change
    if (validationErrors[fieldId]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!form || !form.fields) return false;

    for (const field of form.fields) {
      const val = responses[field.id];
      if (field.isRequired) {
        if (!val || val.trim() === "") {
          errors[field.id] = "This field is required.";
          isValid = false;
        }
      }
      
      // Basic email validation if provided
      if (field.type === "EMAIL" && val && val.trim() !== "") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errors[field.id] = "Please enter a valid email address.";
          isValid = false;
        }
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    // Convert map to array format expected by the API
    const responsePayload = Object.entries(responses).map(([formFieldId, value]) => ({
      formFieldId,
      value,
    }));

    try {
      await submitFormAsync({
        formId,
        responses: responsePayload,
        metadata: {
          userAgent: window.navigator.userAgent,
          completionTime: Date.now(),
        },
      });
      
      setIsSubmitted(true);
      toast.success("Response submitted successfully!");
    } catch (err: any) {
      toast.error("Failed to submit form", {
        description: err?.message || "Something went wrong.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <RefreshCw className="h-6 w-6 animate-spin text-[#E94B35]" />
          <p className="mono text-xs text-[#6E6E6E] uppercase tracking-widest">
            LOADING_FORM...
          </p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-white/10 bg-[#0D0D0D] rounded p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 rounded-full bg-red-500/10 w-12 h-12 flex items-center justify-center text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white mono mb-2">Form Unavailable</h2>
          <p className="text-xs text-[#6E6E6E] mono">
            {error?.message || "This form does not exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
        <div className="max-w-md w-full relative z-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto mb-6 rounded-full bg-[#E94B35]/10 w-20 h-20 flex items-center justify-center text-[#E94B35] border border-[#E94B35]/20 shadow-[0_0_40px_rgba(233,75,53,0.2)]">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="heading-brutalist text-4xl text-white mb-4">Thank You</h1>
          <p className="text-sm text-[#6E6E6E] mono max-w-sm mx-auto">
            Your response for <strong className="text-white">"{form.title}"</strong> has been successfully recorded.
          </p>
          <div className="mt-12 flex items-center justify-center gap-2 opacity-50">
            <span className="text-[10px] mono text-[#6E6E6E] uppercase tracking-widest">Powered by</span>
            <span className="text-[10px] font-bold tracking-widest uppercase mono text-white">
              Mirai<span className="text-[#E94B35]">Forms</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden selection:bg-[#E94B35] selection:text-white pb-20">
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0 fixed" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest uppercase mono text-white">
              Mirai<span className="text-[#E94B35]">Forms</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 relative z-10">
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
        {(!form.fields || form.fields.length === 0) ? (
          <div className="rounded border border-white/10 bg-[#0D0D0D] p-8 text-center shadow-2xl">
            <Info className="h-6 w-6 text-[#6E6E6E] mx-auto mb-3" />
            <p className="text-xs text-[#6E6E6E] mono">This form currently has no fields to fill out.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {form.fields.map((field, idx) => {
                const val = responses[field.id] ?? (field.type === "YES_NO" ? "false" : "");
                const errorMsg = validationErrors[field.id];
                
                return (
                  <div 
                    key={field.id} 
                    className="rounded border border-white/10 bg-[#0D0D0D]/50 p-6 shadow-xl hover:border-white/20 transition-colors"
                  >
                    <Field data-invalid={!!errorMsg || undefined}>
                      <FieldLabel className="text-white text-sm font-semibold tracking-wide uppercase mono flex items-center gap-2">
                        <span className="text-[#E94B35]">{idx + 1}.</span> 
                        {field.label}
                        {field.isRequired && <span className="text-[#E94B35] text-lg leading-none">*</span>}
                      </FieldLabel>
                      
                      {field.description && (
                        <FieldDescription className="text-xs text-[#6E6E6E] mono mb-4 block">
                          {field.description}
                        </FieldDescription>
                      )}

                      <div className="mt-3">
                        {/* TEXT / EMAIL / NUMBER / PASSWORD */}
                        {(field.type === "TEXT" || field.type === "EMAIL" || field.type === "NUMBER" || field.type === "PASSWORD") && (
                          <Input
                            type={field.type.toLowerCase()}
                            placeholder={field.placeholder || "Your answer..."}
                            value={val}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            disabled={isSubmitting}
                            className="bg-[#080808] border-white/10 text-white placeholder-[#404040] focus:border-[#E94B35]/50 focus:ring-1 focus:ring-[#E94B35]/30 rounded text-sm px-4 py-3 h-auto"
                          />
                        )}

                        {/* SELECT */}
                        {field.type === "SELECT" && (
                          <Select
                            value={val}
                            onValueChange={(v) => handleChange(field.id, v)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className="bg-[#080808] border-white/10 text-white focus:border-[#E94B35]/50 rounded text-sm h-12">
                              <SelectValue placeholder={field.placeholder || "Select an option..."} />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0D0D0D] border-white/10">
                              {/* Using generic options since 'options' column doesn't exist yet */}
                              <SelectItem value="Option A" className="text-white text-xs hover:bg-white/5 focus:bg-white/5 cursor-pointer">Option A</SelectItem>
                              <SelectItem value="Option B" className="text-white text-xs hover:bg-white/5 focus:bg-white/5 cursor-pointer">Option B</SelectItem>
                              <SelectItem value="Option C" className="text-white text-xs hover:bg-white/5 focus:bg-white/5 cursor-pointer">Option C</SelectItem>
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
                              className="data-[state=checked]:bg-[#E94B35]"
                            />
                            <span className="text-sm mono text-white">
                              {val === "true" ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                      </div>

                      {errorMsg && (
                        <FieldError className="text-xs text-[#FF3B30] mono mt-2 block">
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
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    SUBMITTING...
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
