import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addVote, Vote } from '@/api/votes';
import { queryKeys } from '@/hooks/use-cats';

type VoteInput = {
  imageId: string;
  value: 1 | -1;
};

// Stand-in id until onSettled refetches the real one; never sent to the API.
const OPTIMISTIC_VOTE_ID = -1;

/** Optimistic vote: bump the cached votes now, roll back on error, reconcile on settle. */
export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, value }: VoteInput) => addVote(imageId, value),

    onMutate: async ({ imageId, value }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.votes });
      const previous = queryClient.getQueryData<Vote[]>(queryKeys.votes);

      queryClient.setQueryData<Vote[]>(queryKeys.votes, (current = []) => [
        ...current,
        { id: OPTIMISTIC_VOTE_ID, image_id: imageId, value },
      ]);

      return { previous };
    },

    onError: (_error, _input, context) => {
      if (context) {
        queryClient.setQueryData(queryKeys.votes, context.previous);
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.votes }),
  });
}
