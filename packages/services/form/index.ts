import { db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import {
  type CreateFormInputType,
  ListFormByUserIdInputType,
  createFormInput,
  listFormByUserIdInput,
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
}

export default FromService;
