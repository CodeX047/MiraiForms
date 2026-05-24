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
        className="gap-2"
        size="default"
      >
        <Plus className="h-4 w-4" />
        Create Form
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new form</DialogTitle>
            <DialogDescription>
              Give your form a title and an optional description. You can always
              change these later.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-1">
            {/* Title Field */}
            <Field data-invalid={!!fieldErrors.title || undefined}>
              <FieldLabel htmlFor="form-title">Title</FieldLabel>
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
              />
              <div className="flex items-center justify-between">
                {fieldErrors.title ? (
                  <FieldError>{fieldErrors.title}</FieldError>
                ) : (
                  <FieldDescription>Max 55 characters</FieldDescription>
                )}
                <span className="text-xs tabular-nums text-muted-foreground">
                  {title.length}/55
                </span>
              </div>
            </Field>

            {/* Description Field */}
            <Field data-invalid={!!fieldErrors.description || undefined}>
              <FieldLabel htmlFor="form-description">
                Description{" "}
                <span className="text-muted-foreground font-normal">
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
              />
              <div className="flex items-center justify-between">
                {fieldErrors.description ? (
                  <FieldError>{fieldErrors.description}</FieldError>
                ) : (
                  <FieldDescription>Max 300 characters</FieldDescription>
                )}
                <span className="text-xs tabular-nums text-muted-foreground">
                  {description.length}/300
                </span>
              </div>
            </Field>

            {/* Actions */}
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Form
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
