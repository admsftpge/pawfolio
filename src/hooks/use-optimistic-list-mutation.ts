import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

type Options<TInput, TItem> = {
  queryKey: QueryKey;
  mutationFn: (input: TInput) => Promise<void>;
  /** Pure flip of the cached list — how the optimistic guess should look. */
  update: (current: TItem[], input: TInput) => TItem[];
};

/**
 * The optimistic ceremony shared by list mutations: cancel in-flight refetches,
 * snapshot, apply the optimistic update, roll back on error, reconcile with
 * the server on settle.
 */
export function useOptimisticListMutation<TInput, TItem>({
  queryKey,
  mutationFn,
  update,
}: Options<TInput, TItem>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onMutate: async (input: TInput) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TItem[]>(queryKey);

      queryClient.setQueryData<TItem[]>(queryKey, (current = []) => update(current, input));

      return { previous };
    },

    onError: (_error, _input, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}
