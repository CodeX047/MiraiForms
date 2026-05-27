import { db, eq, desc, and, sql } from "@repo/database";
import { formSubmissionTable } from "@repo/database/models/form-submission";
import {
  type SubmitFormInputType,
  type ListFormSubmissionsInputType,
  submitFormInput,
  listFormSubmissionsInput,
} from "./model";

class FormSubmissionService {
  public async submitForm(payload: SubmitFormInputType) {
    const { formId, responses, metadata } = await submitFormInput.parseAsync(payload);

    // Prevent duplicate submission (same form, same IP, and same userAgent)
    if (metadata?.ip) {
      const existing = await db
        .select({ id: formSubmissionTable.id })
        .from(formSubmissionTable)
        .where(
          and(
            eq(formSubmissionTable.formId, formId),
            sql`${formSubmissionTable.metadata}->>'ip' = ${metadata.ip}`,
            sql`${formSubmissionTable.metadata}->>'userAgent' = ${metadata.userAgent || ""}`
          )
        )
        .limit(1);

      if (existing.length > 0) {
        throw new Error("ALREADY_SUBMITTED");
      }
    }

    const result = await db
      .insert(formSubmissionTable)
      .values({
        formId,
        responses,
        metadata: metadata || null,
      })
      .returning({ id: formSubmissionTable.id });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error("Something went wrong while saving the form submission");

    return { id: result[0].id };
  }

  public async getFormSubmissions(payload: ListFormSubmissionsInputType) {
    const { formId } = await listFormSubmissionsInput.parseAsync(payload);

    const submissions = await db
      .select({
        id: formSubmissionTable.id,
        formId: formSubmissionTable.formId,
        responses: formSubmissionTable.responses,
        metadata: formSubmissionTable.metadata,
        createdAt: formSubmissionTable.createdAt,
      })
      .from(formSubmissionTable)
      .where(eq(formSubmissionTable.formId, formId))
      .orderBy(desc(formSubmissionTable.createdAt));

    return submissions;
  }
}

export default FormSubmissionService;
