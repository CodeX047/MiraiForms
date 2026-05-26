import { db, eq, asc } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import {
  type CreateFormInputType,
  ListFormByUserIdInputType,
  createFormInput,
  listFormByUserIdInput,
  type GetFormByIdInputType,
  getFormByIdInput,
} from "./model";

class FromService {
  public async createFrom(payload: CreateFormInputType) {
    const { title, description, createdBy } = await createFormInput.parseAsync(payload);

    const result = await db
      .insert(formsTable)
      .values({ title, description, createdBy })
      .returning({ id: formsTable.id });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error("Something went wrong while creating the form");

    return { id: result[0].id };
  }

  public async listFormByUserId(payload: ListFormByUserIdInputType) {
    const { userId } = await listFormByUserIdInput.parseAsync(payload);

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));

    return forms;
  }

  public async getFormById(payload: GetFormByIdInputType) {
    const { formId } = await getFormByIdInput.parseAsync(payload);

    const rows = await db
      .select({
        form: {
          id: formsTable.id,
          title: formsTable.title,
          description: formsTable.description,
          createdAt: formsTable.createdAt,
          updatedAt: formsTable.updatedAt,
        },
        field: {
          id: formFieldsTable.id,
          label: formFieldsTable.label,
          labelKey: formFieldsTable.labelKey,
          description: formFieldsTable.description,
          placeholder: formFieldsTable.placeholder,
          isRequired: formFieldsTable.isRequired,
          type: formFieldsTable.type,
          index: formFieldsTable.index,
        },
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
      .where(eq(formsTable.id, formId))
      .orderBy(asc(formFieldsTable.index));

    if (!rows || rows.length === 0)
      throw new Error(`Form with ID : ${formId} does not exist`);

    const form = rows[0]!.form;
    const fields = rows
      .map((r) => r.field)
      .filter((f): f is NonNullable<typeof f> => f !== null);

    return {
      ...form,
      fields,
    };
  }
}

export default FromService;
