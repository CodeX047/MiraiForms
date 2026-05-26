import { z } from "zod";

export const createFormInputModel = z.object({
  title: z.string().max(55).describe("Title of the form"),
  description: z.string().max(300).optional().describe("Description of the form"),
});

export const createFromOutputModel = z.object({
  id: z.string().describe("ID of the created form"),
});

export const listFormOutputModel = z
  .array(
    z.object({
      id: z.string().describe("ID of the form"),
      title: z.string().describe("Title of the form"),
      description: z.string().nullable().optional().describe("Description of the form"),
      createdAt: z.date().nullable().describe("Creation date of the form"),
      updatedAt: z.date().nullable().describe("Updation date of the form"),
    }),
  )
  .describe("List of forms");

const feildTypeEnum = z.enum(["TEXT", "EMAIL", "NUMBER", "SELECT", "YES_NO", "PASSWORD"]);

export const createFeildInputModel = z.object({
  label: z.string().max(100).describe("Display label for the field"),
  type: feildTypeEnum.describe("Type of the field"),
  formId: z.string().uuid().describe("UUID of the form this field belongs to"),
  description: z.string().optional().describe("Helper text shown below the field"),
  placeholder: z.string().optional().describe("Placeholder text for the field"),
  isRequired: z.boolean().optional().default(false).describe("Whether the field is required"),
});

export const createFeildOutputModel = z.object({
  id: z.string().describe("ID of the created field"),
  labelKey: z.string().describe("Generated key for the field label"),
  index: z.string().describe("Display order index"),
});

export const updateFeildInputModel = z.object({
  feildId: z.string().uuid().describe("UUID of the field to update"),
  lable: z.string().max(100).optional().describe("Updated display label"),
  type: feildTypeEnum.optional().describe("Updated field type"),
  description: z.string().optional().nullable().describe("Updated helper text"),
  placeholder: z.string().optional().nullable().describe("Updated placeholder text"),
  isRequired: z.boolean().optional().describe("Updated required flag"),
});

export const updateFeildOutputModel = z.object({
  id: z.string().describe("ID of the updated field"),
});

export const getFeildsInputModel = z.object({
  formId: z.string().uuid().describe("UUID of the form to fetch fields for"),
});

export const getFeildsOutputModel = z.array(
  z.object({
    id: z.string().describe("ID of the field"),
    label: z.string().describe("Display label"),
    labelKey: z.string().describe("Generated label key"),
    description: z.string().nullable().describe("Helper text"),
    placeholder: z.string().nullable().describe("Placeholder text"),
    isRequired: z.boolean().describe("Whether the field is required"),
    type: z
      .enum(["TEXT", "EMAIL", "NUMBER", "SELECT", "YES_NO", "PASSWORD"])
      .describe("Field type"),
    index: z.string().describe("Display order index"),
  }),
);

export const deleteFeildInputModel = z.object({
  feildId: z.string().uuid().describe("UUID of the field to delete"),
});

export const deleteFeildOutputModel = z.object({
  id: z.string().describe("ID of the deleted field"),
});
