"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Layers,
  GripVertical,
  Type,
  Mail,
  Hash,
  List,
  ToggleLeft,
  Lock,
  Asterisk,
} from "lucide-react";
import { toast } from "sonner";

import {
  useGetFeilds,
  useCreateFeild,
  useUpdateFeild,
  useDeleteFeild,
} from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Field, FieldLabel, FieldDescription, FieldError } from "~/components/ui/field";

// ── Constants ──────────────────────────────────────────────────────────

const FIELD_TYPES = [
  { value: "TEXT", label: "Text", icon: Type },
  { value: "EMAIL", label: "Email", icon: Mail },
  { value: "NUMBER", label: "Number", icon: Hash },
  { value: "SELECT", label: "Select", icon: List },
  { value: "YES_NO", label: "Yes / No", icon: ToggleLeft },
  { value: "PASSWORD", label: "Password", icon: Lock },
] as const;

type FeildType = (typeof FIELD_TYPES)[number]["value"];

function getFieldIcon(type: string) {
  const entry = FIELD_TYPES.find((f) => f.value === type);
  return entry?.icon ?? Type;
}

function getFieldLabel(type: string) {
  const entry = FIELD_TYPES.find((f) => f.value === type);
  return entry?.label ?? type;
}

// ── Types ──────────────────────────────────────────────────────────────

interface FeildItem {
  id: string;
  label: string;
  labelKey: string;
  description: string | null;
  placeholder: string | null;
  isRequired: boolean;
  type: string;
  index: string;
}

interface FieldFormErrors {
  label?: string;
}

// ── Create Field Modal ─────────────────────────────────────────────────

function CreateFeildModal({
  formId,
  open,
  onOpenChange,
}: {
  formId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FeildType>("TEXT");
  const [description, setDescription] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [errors, setErrors] = useState<FieldFormErrors>({});

  const { createFeildAsync, status } = useCreateFeild(formId);
  const isPending = status === "pending";

  const reset = () => {
    setLabel("");
    setType("TEXT");
    setDescription("");
    setPlaceholder("");
    setIsRequired(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const e: FieldFormErrors = {};
    if (!label.trim()) e.label = "Label is required.";
    else if (label.length > 100) e.label = "Label must be 100 characters or less.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createFeildAsync({
        label: label.trim(),
        type,
        formId,
        description: description.trim() || undefined,
        placeholder: placeholder.trim() || undefined,
        isRequired,
      });

      toast.success("Field created!", {
        description: `"${label.trim()}" has been added to your form.`,
      });

      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Failed to create field", {
        description: err?.message || "Something went wrong.",
      });
    }
  };

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0D0D0D] border border-white/10 rounded shadow-2xl">
        <DialogHeader>
          <DialogTitle className="heading-brutalist text-white text-2xl tracking-wide uppercase">
            Add New Field
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          {/* Label */}
          <Field data-invalid={!!errors.label || undefined}>
            <FieldLabel
              htmlFor="feild-label"
              className="text-white text-xs font-semibold tracking-wide uppercase mono"
            >
              Label
            </FieldLabel>
            <Input
              id="feild-label"
              placeholder="e.g. Full Name"
              maxLength={100}
              disabled={isPending}
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                if (errors.label) setErrors({});
              }}
              autoFocus
              className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
            />
            <div className="flex items-center justify-between mt-1">
              {errors.label ? (
                <FieldError className="text-xs text-[#FF3B30] mono">{errors.label}</FieldError>
              ) : (
                <FieldDescription className="text-[10px] text-[#6E6E6E] mono">
                  Max 100 characters
                </FieldDescription>
              )}
              <span className="text-[10px] tabular-nums text-[#6E6E6E] mono">
                {label.length}/100
              </span>
            </div>
          </Field>

          {/* Type */}
          <Field>
            <FieldLabel className="text-white text-xs font-semibold tracking-wide uppercase mono">
              Type
            </FieldLabel>
            <Select value={type} onValueChange={(v) => setType(v as FeildType)} disabled={isPending}>
              <SelectTrigger className="bg-[#080808] border-white/10 text-white focus:border-[#E94B35]/50 rounded text-xs h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0D0D0D] border-white/10">
                {FIELD_TYPES.map((ft) => {
                  const Icon = ft.icon;
                  return (
                    <SelectItem
                      key={ft.value}
                      value={ft.value}
                      className="text-white text-xs hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-[#6E6E6E]" />
                        {ft.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel className="text-white text-xs font-semibold tracking-wide uppercase mono">
              Description{" "}
              <span className="text-[#6E6E6E] font-normal lowercase italic">(optional)</span>
            </FieldLabel>
            <Textarea
              placeholder="Helper text shown below the field..."
              rows={2}
              disabled={isPending}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
            />
          </Field>

          {/* Placeholder */}
          <Field>
            <FieldLabel className="text-white text-xs font-semibold tracking-wide uppercase mono">
              Placeholder{" "}
              <span className="text-[#6E6E6E] font-normal lowercase italic">(optional)</span>
            </FieldLabel>
            <Input
              placeholder="e.g. Enter your name"
              disabled={isPending}
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
            />
          </Field>

          {/* Required */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="feild-required"
              checked={isRequired}
              onCheckedChange={(v) => setIsRequired(v === true)}
              disabled={isPending}
              className="border-white/20 data-[state=checked]:bg-[#E94B35] data-[state=checked]:border-[#E94B35]"
            />
            <label
              htmlFor="feild-required"
              className="text-xs text-white mono cursor-pointer select-none"
            >
              Required field
            </label>
          </div>

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
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Field
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Field Modal ───────────────────────────────────────────────────

function EditFeildModal({
  formId,
  feild,
  open,
  onOpenChange,
}: {
  formId: string;
  feild: FeildItem;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [label, setLabel] = useState(feild.label);
  const [type, setType] = useState<FeildType>(feild.type as FeildType);
  const [description, setDescription] = useState(feild.description ?? "");
  const [placeholder, setPlaceholder] = useState(feild.placeholder ?? "");
  const [isRequired, setIsRequired] = useState(feild.isRequired);
  const [errors, setErrors] = useState<FieldFormErrors>({});

  const { updateFeildAsync, status } = useUpdateFeild(formId);
  const isPending = status === "pending";

  const validate = (): boolean => {
    const e: FieldFormErrors = {};
    if (!label.trim()) e.label = "Label is required.";
    else if (label.length > 100) e.label = "Label must be 100 characters or less.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateFeildAsync({
        feildId: feild.id,
        lable: label.trim() !== feild.label ? label.trim() : undefined,
        type: type !== feild.type ? type : undefined,
        description: description.trim() !== (feild.description ?? "") ? description.trim() || null : undefined,
        placeholder: placeholder.trim() !== (feild.placeholder ?? "") ? placeholder.trim() || null : undefined,
        isRequired: isRequired !== feild.isRequired ? isRequired : undefined,
      });

      toast.success("Field updated!", {
        description: `"${label.trim()}" has been saved.`,
      });

      onOpenChange(false);
    } catch (err: any) {
      toast.error("Failed to update field", {
        description: err?.message || "Something went wrong.",
      });
    }
  };

  // Sync with prop changes when a different field is selected
  React.useEffect(() => {
    setLabel(feild.label);
    setType(feild.type as FeildType);
    setDescription(feild.description ?? "");
    setPlaceholder(feild.placeholder ?? "");
    setIsRequired(feild.isRequired);
    setErrors({});
  }, [feild]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0D0D0D] border border-white/10 rounded shadow-2xl">
        <DialogHeader>
          <DialogTitle className="heading-brutalist text-white text-2xl tracking-wide uppercase">
            Edit Field
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          {/* Label */}
          <Field data-invalid={!!errors.label || undefined}>
            <FieldLabel
              htmlFor="edit-feild-label"
              className="text-white text-xs font-semibold tracking-wide uppercase mono"
            >
              Label
            </FieldLabel>
            <Input
              id="edit-feild-label"
              maxLength={100}
              disabled={isPending}
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                if (errors.label) setErrors({});
              }}
              autoFocus
              className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
            />
            <div className="flex items-center justify-between mt-1">
              {errors.label ? (
                <FieldError className="text-xs text-[#FF3B30] mono">{errors.label}</FieldError>
              ) : (
                <FieldDescription className="text-[10px] text-[#6E6E6E] mono">
                  Max 100 characters
                </FieldDescription>
              )}
              <span className="text-[10px] tabular-nums text-[#6E6E6E] mono">
                {label.length}/100
              </span>
            </div>
          </Field>

          {/* Type */}
          <Field>
            <FieldLabel className="text-white text-xs font-semibold tracking-wide uppercase mono">
              Type
            </FieldLabel>
            <Select value={type} onValueChange={(v) => setType(v as FeildType)} disabled={isPending}>
              <SelectTrigger className="bg-[#080808] border-white/10 text-white focus:border-[#E94B35]/50 rounded text-xs h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0D0D0D] border-white/10">
                {FIELD_TYPES.map((ft) => {
                  const Icon = ft.icon;
                  return (
                    <SelectItem
                      key={ft.value}
                      value={ft.value}
                      className="text-white text-xs hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-[#6E6E6E]" />
                        {ft.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel className="text-white text-xs font-semibold tracking-wide uppercase mono">
              Description{" "}
              <span className="text-[#6E6E6E] font-normal lowercase italic">(optional)</span>
            </FieldLabel>
            <Textarea
              rows={2}
              disabled={isPending}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
            />
          </Field>

          {/* Placeholder */}
          <Field>
            <FieldLabel className="text-white text-xs font-semibold tracking-wide uppercase mono">
              Placeholder{" "}
              <span className="text-[#6E6E6E] font-normal lowercase italic">(optional)</span>
            </FieldLabel>
            <Input
              disabled={isPending}
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
            />
          </Field>

          {/* Required */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="edit-feild-required"
              checked={isRequired}
              onCheckedChange={(v) => setIsRequired(v === true)}
              disabled={isPending}
              className="border-white/20 data-[state=checked]:bg-[#E94B35] data-[state=checked]:border-[#E94B35]"
            />
            <label
              htmlFor="edit-feild-required"
              className="text-xs text-white mono cursor-pointer select-none"
            >
              Required field
            </label>
          </div>

          {/* Actions */}
          <DialogFooter className="pt-2 gap-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
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
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Confirmation Dialog ─────────────────────────────────────────

function DeleteFeildDialog({
  formId,
  feild,
  open,
  onOpenChange,
}: {
  formId: string;
  feild: FeildItem;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { deleteFeildAsync, status } = useDeleteFeild(formId);
  const isPending = status === "pending";

  const handleDelete = async () => {
    try {
      await deleteFeildAsync({ feildId: feild.id });

      toast.success("Field deleted", {
        description: `"${feild.label}" has been removed.`,
      });

      onOpenChange(false);
    } catch (err: any) {
      toast.error("Failed to delete field", {
        description: err?.message || "Something went wrong.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-[#0D0D0D] border border-white/10 rounded shadow-2xl">
        <DialogHeader>
          <DialogTitle className="heading-brutalist text-white text-xl tracking-wide uppercase">
            Delete Field
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <p className="text-sm text-[#6E6E6E] mono leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">&quot;{feild.label}&quot;</span>? This action
            cannot be undone.
          </p>
        </div>

        <DialogFooter className="pt-4 gap-2 flex justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-white hover:bg-white/5 hover:text-white text-xs uppercase mono rounded cursor-pointer h-10 px-4"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="bg-[#FF3B30] text-white hover:bg-[#E94B35] transition-all text-xs uppercase mono rounded cursor-pointer h-10 px-4"
          >
            {isPending ? (
              <>
                <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Field Card ─────────────────────────────────────────────────────────

function FeildCard({
  feild,
  onEdit,
  onDelete,
}: {
  feild: FeildItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = getFieldIcon(feild.type);

  return (
    <div className="group relative rounded border border-white/10 bg-[#0D0D0D] p-5 transition-all hover:border-white/20 overflow-hidden">
      {/* Hover glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E94B35] via-[#FF3B30] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-4">
        {/* Left: icon + details */}
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Drag handle placeholder + type icon */}
          <div className="flex items-center gap-2 pt-0.5 shrink-0">
            <GripVertical className="h-4 w-4 text-[#6E6E6E]/40 group-hover:text-[#6E6E6E] transition-colors cursor-grab" />
            <div className="inline-flex items-center justify-center w-9 h-9 border border-white/10 rounded bg-[#080808] group-hover:border-[#E94B35]/30 transition-all">
              <Icon className="h-4 w-4 text-[#E94B35]" />
            </div>
          </div>

          {/* Field info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white text-sm">{feild.label}</span>
              {feild.isRequired && (
                <span className="inline-flex items-center gap-0.5 text-[10px] mono text-[#E94B35] border border-[#E94B35]/30 rounded px-1.5 py-0.5 uppercase tracking-wider">
                  <Asterisk className="h-2.5 w-2.5" />
                  Required
                </span>
              )}
            </div>

            {/* Type badge */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] mono text-[#6E6E6E] border border-white/10 rounded px-1.5 py-0.5 uppercase tracking-wider bg-white/5">
                {getFieldLabel(feild.type)}
              </span>
              <span className="text-[10px] mono text-[#6E6E6E]/50">
                KEY: {feild.labelKey}
              </span>
            </div>

            {/* Description */}
            {feild.description && (
              <p className="mt-2 text-xs text-[#6E6E6E] line-clamp-2 leading-relaxed mono">
                {feild.description}
              </p>
            )}

            {/* Placeholder preview */}
            {feild.placeholder && (
              <p className="mt-1 text-[10px] text-[#6E6E6E]/50 italic mono">
                Placeholder: &quot;{feild.placeholder}&quot;
              </p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="h-8 w-8 p-0 text-[#6E6E6E] hover:text-white hover:bg-white/5 rounded cursor-pointer transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-[#6E6E6E] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded cursor-pointer transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────

export default function FormBuilderPage() {
  const params = useParams<{ formId: string }>();
  const formId = params.formId;

  const { feilds, isLoading, error } = useGetFeilds(formId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editFeild, setEditFeild] = useState<FeildItem | null>(null);
  const [deleteFeild, setDeleteFeild] = useState<FeildItem | null>(null);

  return (
    <main className="min-h-screen bg-[#080808] text-[#F5F5F5] relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
            >
              <h1 className="text-sm font-bold tracking-widest uppercase mono">
                Mirai<span className="text-[#E94B35]">Forms</span>
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "h-8 w-8 border border-white/10 hover:border-[#E94B35]/50 transition-colors",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 relative z-10">
        {/* Breadcrumb + Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/forms"
            className="inline-flex items-center gap-2 text-xs mono text-[#6E6E6E] hover:text-[#E94B35] mb-5 transition-colors group"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            BACK_TO_FORMS
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="heading-brutalist text-4xl text-white">Form Builder</h2>
              <p className="text-xs mono text-[#6E6E6E] mt-1 uppercase tracking-wider">
                ID: {formId}
              </p>
            </div>
            <Button
              id="add-field-button"
              onClick={() => setCreateOpen(true)}
              className="gap-2 bg-[#080808] border border-[#E94B35] text-white hover:bg-[#E94B35] transition-all cursor-pointer font-bold mono text-xs uppercase tracking-wider rounded px-5 py-2.5 shadow-[0_0_20px_rgba(233,75,53,0.15)] hover:shadow-[0_0_30px_rgba(233,75,53,0.3)]"
            >
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>
        </div>

        {/* Field List */}
        <div className="rounded border border-white/10 bg-[#0D0D0D]/50 shadow-2xl overflow-hidden">
          {isLoading ? (
            /* Loading Skeleton */
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs mono text-[#6E6E6E]">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#E94B35]" />
                LOADING_FORM_FIELDS...
              </div>
              <div className="space-y-3 pt-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="rounded border border-white/5 bg-[#0D0D0D] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 bg-white/5 rounded animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/5 rounded animate-pulse w-1/3" />
                        <div className="h-3 bg-white/5 rounded animate-pulse w-1/5" />
                        <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-red-500/10 p-3 text-red-400">⚠️</div>
              <h3 className="text-sm font-bold text-white mono">Failed to load fields</h3>
              <p className="mt-1 text-xs text-[#6E6E6E] max-w-md mono">
                {error?.message || "There was an error fetching the form fields. Please refresh."}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#080808] border border-white/10 hover:border-red-500/50 hover:bg-[#0D0D0D] text-white text-xs mono"
              >
                RETRY_CONNECTION
              </Button>
            </div>
          ) : !feilds || feilds.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="mb-4 rounded bg-[#E94B35]/10 p-4 text-[#E94B35] border border-[#E94B35]/20 shadow-inner">
                <Layers className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white mono">No fields yet</h3>
              <p className="mt-2 text-xs text-[#6E6E6E] max-w-sm mono">
                This form doesn&apos;t have any fields. Add your first field to start building.
              </p>
              <Button
                onClick={() => setCreateOpen(true)}
                className="mt-6 gap-2 bg-[#080808] border border-[#E94B35] text-white hover:bg-[#E94B35] transition-all cursor-pointer font-bold mono text-xs uppercase tracking-wider rounded px-5 py-2.5 shadow-[0_0_20px_rgba(233,75,53,0.15)] hover:shadow-[0_0_30px_rgba(233,75,53,0.3)]"
              >
                <Plus className="h-4 w-4" />
                Add First Field
              </Button>
            </div>
          ) : (
            /* Field Cards */
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between px-1 pb-2 border-b border-white/5">
                <span className="text-[10px] mono text-[#6E6E6E] uppercase tracking-widest">
                  {feilds.length} field{feilds.length !== 1 ? "s" : ""}
                </span>
                <span className="text-[10px] mono text-[#6E6E6E]/50 uppercase tracking-widest">
                  Ordered by index
                </span>
              </div>
              {feilds.map((feild) => (
                <FeildCard
                  key={feild.id}
                  feild={feild}
                  onEdit={() => setEditFeild(feild)}
                  onDelete={() => setDeleteFeild(feild)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateFeildModal formId={formId} open={createOpen} onOpenChange={setCreateOpen} />

      {editFeild && (
        <EditFeildModal
          formId={formId}
          feild={editFeild}
          open={!!editFeild}
          onOpenChange={(v) => {
            if (!v) setEditFeild(null);
          }}
        />
      )}

      {deleteFeild && (
        <DeleteFeildDialog
          formId={formId}
          feild={deleteFeild}
          open={!!deleteFeild}
          onOpenChange={(v) => {
            if (!v) setDeleteFeild(null);
          }}
        />
      )}
    </main>
  );
}
