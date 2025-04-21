import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";
import type { MutationParams } from "~/types/type";

export const useMutate = <TData = any, TVariables = MutationParams, TError = unknown>({
  ...options
}: UseMutationOptions<TData, TError, TVariables>) => {
  const { $api } = useApi();

  return useMutation<TData, TError, TVariables>({
    mutationFn: async ({ method = "post", link, data = null, params, headers }) => {
      const response = await $api<TData>(link, {
        method,
        body: data,
        query: params,
        headers
      });
      return response;
    },
    retry: 1,
    ...options
  });
};
