"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, Plus, RefreshCw, Layers, Eye } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { toast } from "sonner";

import { useGetFeilds, useUpdateFeild, useGetForm } from "~/hooks/api/form";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";

import { FeildItem } from "~/components/form-builder/types";
import { CreateFeildModal } from "~/components/form-builder/create-feild-modal";
import { EditFeildModal } from "~/components/form-builder/edit-feild-modal";
import { DeleteFeildDialog } from "~/components/form-builder/delete-feild-dialog";
import { FeildCard } from "~/components/form-builder/feild-card";

export default function FormBuilderPage() {
  const params = useParams<{ formId: string }>();
  const formId = params.formId;

  const utils = trpc.useUtils();
  const { feilds, isLoading, error } = useGetFeilds(formId);
  const { updateFeildAsync } = useUpdateFeild(formId);
  const { form } = useGetForm(formId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editFeild, setEditFeild] = useState<FeildItem | null>(null);
  const [deleteFeild, setDeleteFeild] = useState<FeildItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Small threshold ensures clicks on edit/delete still trigger normally
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !feilds) return;

    const oldIndex = feilds.findIndex((f) => f.id === active.id);
    const newIndex = feilds.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // 1. Calculate the new fractional index
    const reordered = arrayMove(feilds, oldIndex, newIndex);
    let newFractionalIndex: string;

    if (newIndex === 0) {
      // Moved to very beginning
      const nextIdx = parseFloat(reordered[1]!.index);
      newFractionalIndex = (nextIdx - 1.0).toFixed(2);
    } else if (newIndex === reordered.length - 1) {
      // Moved to very end
      const prevIdx = parseFloat(reordered[reordered.length - 2]!.index);
      newFractionalIndex = (prevIdx + 1.0).toFixed(2);
    } else {
      // Moved between two fields
      const prevIdx = parseFloat(reordered[newIndex - 1]!.index);
      const nextIdx = parseFloat(reordered[newIndex + 1]!.index);
      newFractionalIndex = ((prevIdx + nextIdx) / 2.0).toFixed(2);
    }

    // 2. Perform Optimistic UI Update
    const previousFields = feilds;
    const optimisticallyReordered = reordered.map((field) =>
      field.id === active.id ? { ...field, index: newFractionalIndex } : field
    );

    // Sort optimistic state in ascending order of indexes to keep views perfectly aligned
    optimisticallyReordered.sort((a, b) => parseFloat(a.index) - parseFloat(b.index));
    utils.form.getFeilds.setData({ formId }, optimisticallyReordered);

    // 3. Trigger Background Mutation
    try {
      await updateFeildAsync({
        feildId: active.id as string,
        index: newFractionalIndex,
      });
      toast.success("Order updated successfully");
    } catch (err: any) {
      // Rollback to previous state on failure
      utils.form.getFeilds.setData({ formId }, previousFields);
      toast.error("Failed to reorder field", {
        description: err?.message || "Something went wrong.",
      });
    }
  };

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
              {form ? (
                <p className="text-xs mono text-[#6E6E6E] mt-1 uppercase tracking-wider">
                  TITLE: <span className="text-white/80">{form.title}</span> | SLUG: <span className="text-white/80">/f/{form.slug}</span>
                </p>
              ) : (
                <p className="text-xs mono text-[#6E6E6E] mt-1 uppercase tracking-wider">
                  ID: {formId}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {form && (
                <Link href={`/f/${form.slug}?preview=true`} target="_blank">
                  <Button
                    variant="outline"
                    className="gap-2 border-white/10 hover:border-[#E94B35]/40 text-white hover:bg-white/5 font-bold mono text-xs uppercase tracking-wider rounded px-5 py-2.5 transition-all cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Form
                  </Button>
                </Link>
              )}
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
                  Drag handles to sort
                </span>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={feilds.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {feilds.map((feild) => (
                    <FeildCard
                      key={feild.id}
                      feild={feild}
                      onEdit={() => setEditFeild(feild)}
                      onDelete={() => setDeleteFeild(feild)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
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
