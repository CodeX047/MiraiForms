import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export interface FormSubmissionValue {
  formFieldId: string;
  value: string;
}

export type FormSubmissionValueRow = FormSubmissionValue[];

export interface SubmissionMetadata {
  ip?: string;
  userAgent?: string;
  completionTime?: number;
}

export const formSubmissionTable = pgTable("form_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, {
      onDelete: "cascade",
    }),

  responses: jsonb("responses").$type<FormSubmissionValueRow>(),

  metadata: jsonb("metadata").$type<SubmissionMetadata>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
