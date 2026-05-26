import { db, eq, desc } from "@repo/database";
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
