"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Field, FieldLabel, FieldDescription, FieldError } from "~/components/ui/field";
import { useCreateForm } from "~/hooks/api/form";

export function CreateFormModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const { createFormAsync, status } = useCreateForm();
  const router = useRouter();
  const isPending = status === "pending";

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!title.trim()) {
      errors.title = "Title is required.";
    } else if (title.length > 55) {
      errors.title = "Title must be 55 characters or less.";
    }

    if (description.length > 300) {
      errors.description = "Description must be 300 characters or less.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await createFormAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      toast.success("Form created!", {
        description: `"${title.trim()}" is ready to be built.`,
      });

      setOpen(false);
      resetForm();

      // Navigate to the all forms page
      router.push("/dashboard/forms");
    } catch (err: any) {
      console.error("Create form error:", err);
      const message =
        err?.message || "Something went wrong while creating the form.";
      toast.error("Failed to create form", { description: message });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFieldErrors({});
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        id="create-form-button"
        onClick={() => setOpen(true)}
        className="gap-2 bg-[#080808] border border-[#E94B35] text-white hover:bg-[#E94B35] transition-all cursor-pointer font-bold mono text-xs uppercase tracking-wider rounded px-5 py-2.5 shadow-[0_0_20px_rgba(233,75,53,0.15)] hover:shadow-[0_0_30px_rgba(233,75,53,0.3)]"
        size="default"
      >
        <Plus className="h-4 w-4" />
        Create Form
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-[#0D0D0D] border border-white/10 rounded shadow-2xl">
          <DialogHeader>
            <DialogTitle className="heading-brutalist text-white text-2xl tracking-wide uppercase">
              Create a new form
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6E6E6E] mono">
              / GIVE YOUR EXPERIENCE A TITLE AND OPTIONAL SPECIFICATION DESCRIPTION.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
            {/* Title Field */}
            <Field data-invalid={!!fieldErrors.title || undefined}>
              <FieldLabel htmlFor="form-title" className="text-white text-xs font-semibold tracking-wide uppercase mono">
                Title
              </FieldLabel>
              <Input
                id="form-title"
                placeholder="e.g. Customer Feedback Survey"
                maxLength={55}
                disabled={isPending}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (fieldErrors.title) {
                    setFieldErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
                aria-invalid={!!fieldErrors.title}
                autoFocus
                className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
              />
              <div className="flex items-center justify-between mt-1">
                {fieldErrors.title ? (
                  <FieldError className="text-xs text-[#FF3B30] mono">{fieldErrors.title}</FieldError>
                ) : (
                  <FieldDescription className="text-[10px] text-[#6E6E6E] mono">Max 55 characters</FieldDescription>
                )}
                <span className="text-[10px] tabular-nums text-[#6E6E6E] mono">
                  {title.length}/55
                </span>
              </div>
            </Field>

            {/* Description Field */}
            <Field data-invalid={!!fieldErrors.description || undefined}>
              <FieldLabel htmlFor="form-description" className="text-white text-xs font-semibold tracking-wide uppercase mono">
                Description{" "}
                <span className="text-[#6E6E6E] font-normal lowercase italic">
                  (optional)
                </span>
              </FieldLabel>
              <Textarea
                id="form-description"
                placeholder="Briefly describe what this form is for..."
                rows={3}
                maxLength={300}
                disabled={isPending}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (fieldErrors.description) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      description: undefined,
                    }));
                  }
                }}
                aria-invalid={!!fieldErrors.description}
                className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
              />
              <div className="flex items-center justify-between mt-1">
                {fieldErrors.description ? (
                  <FieldError className="text-xs text-[#FF3B30] mono">{fieldErrors.description}</FieldError>
                ) : (
                  <FieldDescription className="text-[10px] text-[#6E6E6E] mono">Max 300 characters</FieldDescription>
                )}
                <span className="text-[10px] tabular-nums text-[#6E6E6E] mono">
                  {description.length}/300
                </span>
              </div>
            </Field>

            {/* Actions */}
            <DialogFooter className="pt-2 gap-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => handleOpenChange(false)}
                className="border-white/10 text-white hover:bg-white/5 hover:text-white text-xs uppercase mono rounded cursor-pointer h-10 px-4"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending} 
                className="bg-[#E94B35] text-white hover:bg-[#FF3B30] transition-all text-xs uppercase mono rounded cursor-pointer h-10 px-4"
              >
                {isPending ? (
                  <>
                    <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Create
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
