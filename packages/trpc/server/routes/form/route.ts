import { authedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService, formFeildService, formSubmissionService } from "../../services/index";
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
      const form = await formService.getFormById(input);
      return form;
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
    .query(async ({ input }) => {
      const result = await formSubmissionService.getFormSubmissions(input);
      return result;
    }),
});
