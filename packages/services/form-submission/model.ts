import { z } from "zod";

export const formSubmissionValueSchema = z.object({
  formFieldId: z.string().uuid(),
  value: z.string(),
});

export const submissionMetadataSchema = z.object({
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  completionTime: z.number().optional(),
});

export const submitFormInput = z.object({
  formId: z.string().uuid().describe("UUID of the form being submitted"),
  responses: z.array(formSubmissionValueSchema).describe("Array of form field responses"),
  metadata: submissionMetadataSchema.optional().describe("Metadata about the submission"),
});

export type SubmitFormInputType = z.infer<typeof submitFormInput>;

export const listFormSubmissionsInput = z.object({
  formId: z.string().uuid().describe("UUID of the form to list submissions for"),
});

export type ListFormSubmissionsInputType = z.infer<typeof listFormSubmissionsInput>;
