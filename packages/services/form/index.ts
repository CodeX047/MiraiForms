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
  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const finalBase = baseSlug || "form";
    let uniqueSlug = finalBase;
    let counter = 0;

    while (true) {
      const [existing] = await db
        .select({ id: formsTable.id })
        .from(formsTable)
        .where(eq(formsTable.slug, uniqueSlug))
        .limit(1);

      if (!existing) {
        break;
      }

      counter++;
      uniqueSlug = `${finalBase}-${counter}`;
    }

    return uniqueSlug;
  }

  public async createFrom(payload: CreateFormInputType) {
    const { title, description, createdBy } = await createFormInput.parseAsync(payload);

    const slug = await this.generateUniqueSlug(title);

    const result = await db
      .insert(formsTable)
      .values({ title, description, createdBy, slug })
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
        published: formsTable.published,
        slug: formsTable.slug,
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
          published: formsTable.published,
          slug: formsTable.slug,
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
          choices: formFieldsTable.choices,
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

  public async getPublicFormBySlug(payload: { slug: string }) {
    const rows = await db
      .select({
        form: {
          id: formsTable.id,
          title: formsTable.title,
          description: formsTable.description,
          published: formsTable.published,
          slug: formsTable.slug,
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
          choices: formFieldsTable.choices,
        },
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
      .where(eq(formsTable.slug, payload.slug))
      .orderBy(asc(formFieldsTable.index));

    if (!rows || rows.length === 0)
      throw new Error(`Form with slug : ${payload.slug} does not exist`);

    const form = rows[0]!.form;
    const fields = rows
      .map((r) => r.field)
      .filter((f): f is NonNullable<typeof f> => f !== null);

    return {
      ...form,
      fields,
    };
  }

  public async togglePublish(payload: { formId: string; published: boolean; userId: string }) {
    const [form] = await db
      .select({ createdBy: formsTable.createdBy })
      .from(formsTable)
      .where(eq(formsTable.id, payload.formId))
      .limit(1);

    if (!form) {
      throw new Error(`Form with ID ${payload.formId} not found`);
    }

    if (form.createdBy !== payload.userId) {
      throw new Error("Unauthorized to toggle publish state for this form");
    }

    const result = await db
      .update(formsTable)
      .set({ published: payload.published })
      .where(eq(formsTable.id, payload.formId))
      .returning({ id: formsTable.id, published: formsTable.published });

    if (!result || result.length === 0) {
      throw new Error("Failed to update form publish status");
    }

    return result[0]!;
  }
}

export default FromService;
