import { authedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services/index";
import { createFormInputModel, createFromOutputModel, listFormOutputModel } from "./model";
import { z } from "zod";

const TAGS = ["forms"];
const getPath = generatePath("/form");

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
});
