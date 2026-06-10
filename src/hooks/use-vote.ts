import { addVote, Vote } from '@/api/votes';
import { queryKeys } from '@/hooks/use-cats';
import { useOptimisticListMutation } from '@/hooks/use-optimistic-list-mutation';

type VoteInput = {
  imageId: string;
  value: 1 | -1;
};

// Stand-in id until the refetch brings the real one; never sent to the API.
const OPTIMISTIC_VOTE_ID = -1;

export function useVote() {
  return useOptimisticListMutation<VoteInput, Vote>({
    queryKey: queryKeys.votes,

    mutationFn: ({ imageId, value }) => addVote(imageId, value),

    // The API keeps one vote per user per image (upsert), so replace rather than append.
    update: (votes, { imageId, value }) => [
      ...votes.filter((vote) => vote.image_id !== imageId),
      { id: OPTIMISTIC_VOTE_ID, image_id: imageId, value },
    ],
  });
}
