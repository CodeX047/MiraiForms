import React, { useState } from "react";
import { AlertTriangle, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useDeleteForm } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface FormItem {
  id: string;
  title: string;
}

export function DeleteFormDialog({
  form,
  open,
  onOpenChange,
}: {
  form: FormItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { deleteFormAsync } = useDeleteForm();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!form) return null;

  const handleDelete = async () => {
    if (confirmText !== form.title) {
      toast.error("Form title does not match", {
        description: "Please type the exact title to confirm deletion.",
        className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await deleteFormAsync({ formId: form.id });
      toast.success("FORM_DELETED", {
        description: `"${form.title}" has been permanently purged from database telemetry.`,
        className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
      });
      onOpenChange(false);
      setConfirmText("");
    } catch (err) {
      const error = err as { message?: string };
      toast.error("FAILED_TO_DELETE", {
        description: error?.message || "An unexpected error occurred.",
        className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {
      if (!isDeleting) {
        onOpenChange(o);
        setConfirmText("");
      }
    }}>
      <DialogContent className="bg-[#0D0D0D] border-[#FF3B30]/30 text-white rounded max-w-md shadow-[0_0_50px_rgba(255,59,48,0.15)] selection:bg-[#FF3B30] selection:text-white">
        <DialogHeader>
          <div className="mx-auto mb-4 rounded bg-[#FF3B30]/10 p-3 text-[#FF3B30] border border-[#FF3B30]/20 w-fit animate-pulse">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold mono text-center uppercase tracking-widest text-[#FF3B30] drop-shadow-[0_0_8px_rgba(255,59,48,0.3)]">
            PERMANENT_DELETION
          </DialogTitle>
          <DialogDescription className="text-xs mono text-[#6E6E6E] text-center mt-2 uppercase tracking-wide leading-relaxed">
            This action is irreversible. All telemetry, fields, responses, and submissions associated with{" "}
            <strong className="text-white">&quot;{form.title}&quot;</strong> will be permanently purged.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="rounded bg-black/40 border border-white/5 p-4 text-[10px] mono text-[#6E6E6E] leading-normal uppercase">
            To confirm this destruction event, type the exact form title below:
            <span className="block mt-2 text-white font-bold select-all bg-white/5 p-1 rounded text-center border border-white/5 tracking-wider">
              {form.title}
            </span>
          </div>
          <Input
            placeholder="Type form title to confirm..."
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isDeleting}
            className="bg-[#080808] border-white/10 text-white focus:border-[#FF3B30]/50 text-xs rounded mono py-3 h-10 tracking-wide text-center"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button
            variant="ghost"
            onClick={() => {
              onOpenChange(false);
              setConfirmText("");
            }}
            disabled={isDeleting}
            className="border border-white/10 text-[#6E6E6E] hover:text-white hover:bg-white/5 text-xs rounded mono"
          >
            ABORT_MISSION
          </Button>
          <Button
            onClick={handleDelete}
            disabled={confirmText !== form.title || isDeleting}
            className="bg-[#FF3B30]/15 hover:bg-[#FF3B30] border border-[#FF3B30] text-white hover:text-white transition-all text-xs font-bold mono rounded cursor-pointer gap-2 py-2 shadow-[0_0_20px_rgba(255,59,48,0.15)] disabled:opacity-30 disabled:pointer-events-none"
          >
            {isDeleting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                PURGING...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                PURGE_FORM
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
