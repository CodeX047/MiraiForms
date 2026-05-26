import React from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteFeild } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { FeildItem } from "./types";

export function DeleteFeildDialog({
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
