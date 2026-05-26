import React, { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateFeild } from "~/hooks/api/form";
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
import { FIELD_TYPES, FeildType } from "./constants";
import { FieldFormErrors } from "./types";

export function CreateFeildModal({
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
  const [choices, setChoices] = useState<string[]>([]);
  const [newChoice, setNewChoice] = useState("");

  const { createFeildAsync, status } = useCreateFeild(formId);
  const isPending = status === "pending";

  const reset = () => {
    setLabel("");
    setType("TEXT");
    setDescription("");
    setPlaceholder("");
    setIsRequired(false);
    setChoices([]);
    setNewChoice("");
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
        choices: type === "SELECT" ? choices : undefined,
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

          {/* Choices Builder (Only for SELECT type) */}
          {type === "SELECT" && (
            <Field>
              <FieldLabel className="text-white text-xs font-semibold tracking-wide uppercase mono">
                Select Options
              </FieldLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Option Red"
                  value={newChoice}
                  onChange={(e) => setNewChoice(e.target.value)}
                  className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newChoice.trim()) {
                        setChoices((prev) => [...prev, newChoice.trim()]);
                        setNewChoice("");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newChoice.trim()) {
                      setChoices((prev) => [...prev, newChoice.trim()]);
                      setNewChoice("");
                    }
                  }}
                  className="bg-[#0D0D0D] border border-white/10 text-white hover:bg-white/5 rounded text-xs px-3 cursor-pointer h-9"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {choices.length === 0 ? (
                  <span className="text-[10px] text-[#6E6E6E] mono uppercase">No options added yet.</span>
                ) : (
                  choices.map((choice, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 text-[10px] mono text-white bg-white/5 border border-white/10 rounded px-2.5 py-1"
                    >
                      <span>{choice}</span>
                      <button
                        type="button"
                        onClick={() => setChoices((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-[#6E6E6E] hover:text-[#E94B35] focus:outline-none ml-1 text-xs font-bold font-mono"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Field>
          )}

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
