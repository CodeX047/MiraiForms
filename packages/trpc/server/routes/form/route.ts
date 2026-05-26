import { authedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService, formFeildService } from "../../services/index";
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
} from "./model";
import { z } from "zod";

const TAGS = ["forms"];
const FEILD_TAGS = ["form-fields"];
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
    .mutation(async ({ input }) => {
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
    .mutation(async ({ input }) => {
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
    .query(async ({ input }) => {
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
    .mutation(async ({ input }) => {
      const { id } = await formFeildService.deleteFeild(input);
      return { id };
    }),
});
