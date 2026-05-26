import { db, eq, max, asc } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import {
  type CreateFeildInputType,
  createFiledInput,
  type UpdateFeildTypeInputType,
  updateFeildTypeInput,
  type GetFeildsInputType,
  getFeildsInput,
  type DeleteFeildInputType,
  deleteFeildInput,
} from "./model";

function toLabelKey(lable: string): string {
  return lable
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

class FormFeildService {
  private async getNextIndex(formId: string): Promise<string> {
    const result = await db
      .select({ maxIndex: max(formFieldsTable.index) })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));

    const current = result[0]?.maxIndex;
    const next = current ? parseFloat(current) + 1 : 1;
    return next.toFixed(2);
  }

  public async createFeild(payload: CreateFeildInputType) {
    const { label, type, formId, description, placeholder, isRequired } =
      await createFiledInput.parseAsync(payload);

    const labelKey = toLabelKey(label);
    const index = await this.getNextIndex(formId);

    const result = await db
      .insert(formFieldsTable)
      .values({
        label,
        labelKey,
        type,
        formId,
        description,
        placeholder,
        isRequired,
        index,
      })
      .returning({
        id: formFieldsTable.id,
      });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error("Something went wrong while creating feild");

    return { id: result[0].id, labelKey, index };
  }

  public async updateFeild(payload: UpdateFeildTypeInputType) {
    const { feildId, ...updates } = await updateFeildTypeInput.parseAsync(payload);

    const patch: Partial<typeof formFieldsTable.$inferInsert> = {};

    if (updates.lable !== undefined) patch.label = updates.lable;
    if (updates.type !== undefined) patch.type = updates.type;
    if (updates.isRequired !== undefined) patch.isRequired = updates.isRequired;
    if ("description" in updates) patch.description = updates.description ?? null;
    if ("placeholder" in updates) patch.placeholder = updates.placeholder ?? null;

    if (Object.keys(patch).length === 0) throw new Error("No fields provided to update");

    const result = await db
      .update(formFieldsTable)
      .set(patch)
      .where(eq(formFieldsTable.id, feildId))
      .returning({ id: formFieldsTable.id });

    if (!result || result.length === 0)
      throw new Error(`Feild with ID : ${feildId} deos not exist`);

    return { id: result[0]!.id };
  }

  public async getFeilds(payload: GetFeildsInputType) {
    const { formId } = await getFeildsInput.parseAsync(payload);

    const result = await db
      .select({
        id: formFieldsTable.id,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        placeholder: formFieldsTable.placeholder,
        isRequired: formFieldsTable.isRequired,
        type: formFieldsTable.type,
        index: formFieldsTable.index,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(asc(formFieldsTable.index));

    if (!result || result.length === 0)
      throw new Error(`Feilds for form with ID : ${formId} deos not exist`);

    return result;
  }

  public async deleteFeild(payload: DeleteFeildInputType) {
    const { feildId } = await deleteFeildInput.parseAsync(payload);

    const result = await db
      .delete(formFieldsTable)
      .where(eq(formFieldsTable.id, feildId))
      .returning({ id: formFieldsTable.id });

    if (!result || result.length === 0)
      throw new Error(`Feild with ID : ${feildId} deos not exist`);

    return { id: result[0]!.id };
  }
}

export default FormFeildService;
