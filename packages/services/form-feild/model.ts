import { z } from "zod";

const feildTypeEnum = z.enum(["TEXT", "EMAIL", "NUMBER", "SELECT", "YES_NO", "PASSWORD"]);

export const createFiledInput = z.object({
  label: z.string().max(100).describe("Display label for feild"),
  type: feildTypeEnum.describe("Type of the feild"),
  formId: z.string().uuid().describe("UUID of the form this feild belong to"),
  description: z.string().optional().describe("Helper text shown below the feild"),
  placeholder: z.string().optional().describe("Placeholder text for the feild"),
  isRequired: z.boolean().optional().default(false).describe("Weather the feild is required"),
});

export type CreateFeildInputType = z.infer<typeof createFiledInput>;

export const updateFeildTypeInput = z.object({
  feildId: z.string().uuid().describe("UUID of the feild"),
  lable: z.string().max(100).optional().describe("Updated display lable"),
  type: feildTypeEnum.optional().describe("Updated feild type"),
  description: z.string().optional().nullable().describe("Updated helper text"),
  placeholder: z.string().optional().nullable().describe("Updated placeholder text"),
  isRequired: z.boolean().optional().describe("Updated required flag"),
});

export type UpdateFeildTypeInputType = z.infer<typeof updateFeildTypeInput>;

export const getFeildsInput = z.object({
  formId: z.string().uuid().describe("UUID of the form to fetch feilds for"),
});

export type GetFeildsInputType = z.infer<typeof getFeildsInput>;

export const deleteFeildInput = z.object({
  feildId: z.string().uuid().describe("UUID of the feild to delete"),
});

export type DeleteFeildInputType = z.infer<typeof deleteFeildInput>;
