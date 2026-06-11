import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

type Options<TInput, TItem> = {
  queryKey: QueryKey;
  mutationFn: (input: TInput) => Promise<void>;
  update: (current: TItem[], input: TInput) => TItem[];
};

export function useOptimisticListMutation<TInput, TItem>({
  queryKey,
  mutationFn,
  update,
}: Options<TInput, TItem>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [queryKey],
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

    // Reconcile only when the LAST in-flight mutation on this key settles —
    // rapid taps would otherwise each trigger a full refetch that races the
    // server and makes the optimistic score flicker.
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: [queryKey] }) === 1) {
        return queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
