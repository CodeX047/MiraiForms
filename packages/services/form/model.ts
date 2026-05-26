import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().max(55).describe("Title of the form"),
  description: z.string().max(300).optional().describe("Description of the form"),
  createdBy: z.string().min(1).describe("ID of the user creating the form"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const listFormByUserIdInput = z.object({
  userId: z.string().describe("UUID of the user"),
});

export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>;

export const getFormByIdInput = z.object({
  formId: z.string().uuid().describe("UUID of the form"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;

export const deleteFormInput = z.object({
  formId: z.string().uuid().describe("UUID of the form to delete"),
  userId: z.string().min(1).describe("ID of the user performing the deletion"),
});

export type DeleteFormInputType = z.infer<typeof deleteFormInput>;

