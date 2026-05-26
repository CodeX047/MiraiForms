import React from "react";
import { GripVertical, Asterisk, Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FeildItem } from "./types";
import { getFieldIcon, getFieldLabel } from "./constants";

export function FeildCard({
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

            {/* Field choices preview */}
            {feild.type === "SELECT" && feild.choices && feild.choices.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {feild.choices.map((choice, i) => (
                  <span
                    key={i}
                    className="text-[9px] mono text-[#6E6E6E] border border-white/5 bg-white/3 rounded-sm px-1.5 py-0.5"
                  >
                    {choice}
                  </span>
                ))}
              </div>
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
