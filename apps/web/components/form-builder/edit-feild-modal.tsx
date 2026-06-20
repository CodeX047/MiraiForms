import React, { useReducer } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useUpdateFeild } from "~/hooks/api/form";
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
import { FeildItem, FieldFormErrors } from "./types";


type State = {
  label: string;
  type: FeildType;
  description: string;
  placeholder: string;
  isRequired: boolean;
  errors: FieldFormErrors;
  choices: string[];
  newChoice: string;
};

type Action = 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "SET_FIELD"; field: keyof State; value: any };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

export function EditFeildModal({
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
  const [state, dispatch] = useReducer(reducer, {
    label: feild.label,
    type: feild.type as FeildType,
    description: feild.description ?? "",
    placeholder: feild.placeholder ?? "",
    isRequired: feild.isRequired,
    errors: {},
    choices: feild.choices ?? [],
    newChoice: "",
  });

  const { updateFeildAsync, status } = useUpdateFeild(formId);
  const isPending = status === "pending";

  const validate = (): boolean => {
    const e: FieldFormErrors = {};
    if (!state.label.trim()) e.label = "Label is required.";
    else if (state.label.length > 100) e.label = "Label must be 100 characters or less.";
    dispatch({ type: "SET_FIELD", field: "errors", value: e });
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateFeildAsync({
        feildId: feild.id,
        lable: state.label.trim() !== feild.label ? state.label.trim() : undefined,
        type: state.type !== feild.type ? state.type : undefined,
        description: state.description.trim() !== (feild.description ?? "") ? state.description.trim() || null : undefined,
        placeholder: state.placeholder.trim() !== (feild.placeholder ?? "") ? state.placeholder.trim() || null : undefined,
        isRequired: state.isRequired !== feild.isRequired ? state.isRequired : undefined,
        choices: state.type === "SELECT" ? state.choices : null,
      });

      toast.success("Field updated!", {
        description: `"${state.label.trim()}" has been saved.`,
      });

      onOpenChange(false);
    } catch (err: unknown) {
      toast.error("Failed to update field", {
        description: (err as Error)?.message || "Something went wrong.",
      });
    }
  };



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
          <Field data-invalid={!!state.errors.label || undefined}>
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
              value={state.label}
              onChange={(e) => {
                dispatch({ type: "SET_FIELD", field: "label", value: e.target.value });
                if (state.errors.label) dispatch({ type: "SET_FIELD", field: "errors", value: {} });
              }}
              autoFocus
              className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
            />
            <div className="flex items-center justify-between mt-1">
              {state.errors.label ? (
                <FieldError className="text-xs text-[#FF3B30] mono">{state.errors.label}</FieldError>
              ) : (
                <FieldDescription className="text-[10px] text-[#6E6E6E] mono">
                  Max 100 characters
                </FieldDescription>
              )}
              <span className="text-[10px] tabular-nums text-[#6E6E6E] mono">
                {state.label.length}/100
              </span>
            </div>
          </Field>

          {/* Type */}
          <Field>
            <FieldLabel className="text-white text-xs font-semibold tracking-wide uppercase mono">
              Type
            </FieldLabel>
            <Select value={state.type} onValueChange={(v) => dispatch({ type: "SET_FIELD", field: "type", value: v as FeildType })} disabled={isPending}>
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
              value={state.description}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "description", value: e.target.value })}
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
              value={state.placeholder}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "placeholder", value: e.target.value })}
              className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2"
            />
          </Field>

          {/* Required */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="edit-feild-required"
              checked={state.isRequired}
              onCheckedChange={(v) => dispatch({ type: "SET_FIELD", field: "isRequired", value: v === true })}
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

          {/* Choices Builder (Only for SELECT type) */}
          {state.type === "SELECT" && (
            <Field>
              <FieldLabel className="text-white text-xs font-semibold tracking-wide uppercase mono">
                Select Options
              </FieldLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Option Red"
                  value={state.newChoice}
                  onChange={(e) => dispatch({ type: "SET_FIELD", field: "newChoice", value: e.target.value })}
                  className="bg-[#080808] border-white/10 text-white placeholder-[#6E6E6E] focus:border-[#E94B35]/50 rounded text-xs px-3 py-2 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (state.newChoice.trim()) {
                        dispatch({ type: "SET_FIELD", field: "choices", value: [...state.choices, state.newChoice.trim()] });
                        dispatch({ type: "SET_FIELD", field: "newChoice", value: "" });
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (state.newChoice.trim()) {
                      dispatch({ type: "SET_FIELD", field: "choices", value: [...state.choices, state.newChoice.trim()] });
                      dispatch({ type: "SET_FIELD", field: "newChoice", value: "" });
                    }
                  }}
                  className="bg-[#0D0D0D] border border-white/10 text-white hover:bg-white/5 rounded text-xs px-3 cursor-pointer h-9"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {state.choices.length === 0 ? (
                  <span className="text-[10px] text-[#6E6E6E] mono uppercase">No options added yet.</span>
                ) : (
                  state.choices.map((choice, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 text-[10px] mono text-white bg-white/5 border border-white/10 rounded px-2.5 py-1"
                    >
                      <span>{choice}</span>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "SET_FIELD", field: "choices", value: state.choices.filter((_, idx) => idx !== i) })}
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
