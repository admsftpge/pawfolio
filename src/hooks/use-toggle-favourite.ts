import { useQueryClient } from '@tanstack/react-query';

import { addFavourite, Favourite, removeFavourite } from '@/api/favourites';
import { queryKeys } from '@/hooks/use-cats';
import { useOptimisticListMutation } from '@/hooks/use-optimistic-list-mutation';

type ToggleInput = {
  imageId: string;
  favouriteId: number | null;
};

// Stand-in id until the create round-trip returns the real one.
const OPTIMISTIC_FAVOURITE_ID = -1;

export function useToggleFavourite() {
  const queryClient = useQueryClient();

  return useOptimisticListMutation<ToggleInput, Favourite>({
    queryKey: queryKeys.favourites,

    mutationFn: async ({ imageId, favouriteId }) => {
      if (favouriteId === null) {
        const id = await addFavourite(imageId);
        // Swap the optimistic sentinel for the real id immediately, so an
        // unfavourite tapped before the reconciling refetch targets the right row.
        queryClient.setQueryData<Favourite[]>(queryKeys.favourites, (current = []) =>
          current.map((favourite) =>
            favourite.image_id === imageId && favourite.id === OPTIMISTIC_FAVOURITE_ID
              ? { ...favourite, id }
              : favourite,
          ),
        );
      } else if (favouriteId !== OPTIMISTIC_FAVOURITE_ID) {
        await removeFavourite(favouriteId);
      }
      // A sentinel favouriteId means the create hasn't confirmed yet — the
      // optimistic removal already happened and the refetch will reconcile.
    },

    update: (favourites, { imageId, favouriteId }) =>
      favouriteId === null
        ? [...favourites, { id: OPTIMISTIC_FAVOURITE_ID, image_id: imageId }]
        : favourites.filter((favourite) => favourite.id !== favouriteId),
  });
}
