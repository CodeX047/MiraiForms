import { authedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService, formFeildService, formSubmissionService } from "../../services/index";
import { TRPCError } from "@trpc/server";
import { db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import {
  createFormInputModel,
  createFromOutputModel,
  listFormOutputModel,
  createFeildInputModel,
  createFeildOutputModel,
  updateFeildInputModel,
  updateFeildOutputModel,
  getFeildsInputModel,
  getFeildsOutputModel,
  deleteFeildInputModel,
  deleteFeildOutputModel,
  getPublicFormInputModel,
  getPublicFormOutputModel,
  submitFormInputModel,
  submitFormOutputModel,
  getFormSubmissionsInputModel,
  getFormSubmissionsOutputModel,
  togglePublishInputModel,
  togglePublishOutputModel,
  deleteFormInputModel,
  deleteFormOutputModel,
} from "./model";
import { z } from "zod";

const TAGS = ["forms"];
const FEILD_TAGS = ["form-fields"];
const getPath = generatePath("/form");

async function verifyFormOwnership(formId: string, userId: string) {
  const [form] = await db
    .select({ createdBy: formsTable.createdBy })
    .from(formsTable)
    .where(eq(formsTable.id, formId))
    .limit(1);

  if (!form) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Form with ID ${formId} not found`,
    });
  }

  if (form.createdBy !== userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized — you do not own this form",
    });
  }
}

async function verifyFieldOwnership(feildId: string, userId: string) {
  const [field] = await db
    .select({ formId: formFieldsTable.formId })
    .from(formFieldsTable)
    .where(eq(formFieldsTable.id, feildId))
    .limit(1);

  if (!field) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Field with ID ${feildId} not found`,
    });
  }

  await verifyFormOwnership(field.formId, userId);
  return field.formId;
}

export const formRouter = router({
  createForm: authedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFromOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;

      const { id } = await formService.createFrom({
        title,
        description,
        createdBy: ctx.userId,
      });

      return { id };
    }),

  listForms: authedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/listForms"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(z.undefined())
    .output(listFormOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormByUserId({ userId: ctx.userId });

      return forms;
    }),

  createFeild: authedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createFeild"),
        tags: FEILD_TAGS,
        protect: true,
      },
    })
    .input(createFeildInputModel)
    .output(createFeildOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId } = input;
      await verifyFormOwnership(formId, ctx.userId);

      const { id, index, labelKey } = await formFeildService.createFeild(input);
      return { id, index, labelKey };
    }),

  updateFeild: authedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/updateFeild"),
        tags: FEILD_TAGS,
        protect: true,
      },
    })
    .input(updateFeildInputModel)
    .output(updateFeildOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { feildId } = input;
      await verifyFieldOwnership(feildId, ctx.userId);

      const { id } = await formFeildService.updateFeild(input);
      return { id };
    }),

  getFeilds: authedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFeilds"),
        tags: FEILD_TAGS,
        protect: true,
      },
    })
    .input(getFeildsInputModel)
    .output(getFeildsOutputModel)
    .query(async ({ input, ctx }) => {
      const { formId } = input;
      await verifyFormOwnership(formId, ctx.userId);

      const result = await formFeildService.getFeilds(input);
      return result;
    }),

  deleteFeild: authedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteFeild"),
        tags: FEILD_TAGS,
        protect: true,
      },
    })
    .input(deleteFeildInputModel)
    .output(deleteFeildOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { feildId } = input;
      await verifyFieldOwnership(feildId, ctx.userId);

      const { id } = await formFeildService.deleteFeild(input);
      return { id };
    }),

  getPublicForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getPublicForm"),
        tags: TAGS,
      },
    })
    .input(getPublicFormInputModel)
    .output(getPublicFormOutputModel)
    .query(async ({ input }) => {
      const form = await formService.getPublicFormBySlug(input);
      if (!form.published) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This form is not published or does not exist",
        });
      }
      return form;
    }),

  togglePublish: authedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/togglePublish"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(togglePublishInputModel)
    .output(togglePublishOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId, published } = input;
      const result = await formService.togglePublish({
        formId,
        published,
        userId: ctx.userId,
      });
      return result;
    }),

  deleteForm: authedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId } = input;
      await verifyFormOwnership(formId, ctx.userId);

      const result = await formService.deleteForm({
        formId,
        userId: ctx.userId,
      });

      return { id: result.id };
    }),

  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submitForm"),
        tags: TAGS,
      },
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formSubmissionService.submitForm(input);
      return { id };
    }),

  getFormSubmissions: authedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFormSubmissions"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFormSubmissionsInputModel)
    .output(getFormSubmissionsOutputModel)
    .query(async ({ input, ctx }) => {
      const { formId } = input;
      await verifyFormOwnership(formId, ctx.userId);

      const result = await formSubmissionService.getFormSubmissions(input);
      return result;
    }),
});
