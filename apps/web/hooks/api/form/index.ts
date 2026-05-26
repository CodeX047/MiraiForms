import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useListForms = () => {
  const {
    data: forms,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.form.listForms.useQuery();

  return { forms, error, isFetched, isFetching, isLoading, status };
};

export const useCreateFeild = (formId: string) => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFeildAsync,
    mutate: createFeild,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createFeild.useMutation({
    onSuccess: async () => {
      await utils.form.getFeilds.invalidate({ formId });
    },
  });

  return {
    createFeildAsync,
    createFeild,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useUpdateFeild = (formId: string) => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFeildAsync,
    mutate: updateFeild,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.updateFeild.useMutation({
    onSuccess: async () => {
      await utils.form.getFeilds.invalidate({ formId });
    },
  });

  return {
    updateFeildAsync,
    updateFeild,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useGetFeilds = (formId: string) => {
  const {
    data: feilds,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.form.getFeilds.useQuery({ formId });

  return { feilds, error, isFetched, isFetching, isLoading, status };
};

export const useDeleteFeild = (formId: string) => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFeildAsync,
    mutate: deleteFeild,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.deleteFeild.useMutation({
    onSuccess: async () => {
      await utils.form.getFeilds.invalidate({ formId });
    },
  });

  return {
    deleteFeildAsync,
    deleteFeild,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useGetPublicForm = (formId: string) => {
  const {
    data: form,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.form.getPublicForm.useQuery({ formId });

  return { form, error, isFetched, isFetching, isLoading, status };
};

export const useSubmitForm = () => {
  const {
    mutateAsync: submitFormAsync,
    mutate: submitForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.submitForm.useMutation();

  return {
    submitFormAsync,
    submitForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};
