import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addFavourite, Favourite, removeFavourite } from '@/api/favourites';
import { queryKeys } from '@/hooks/use-cats';

type ToggleInput = {
  imageId: string;
  favouriteId: number | null;
};

// Stand-in id until onSettled refetches the real one; never sent to the API.
const OPTIMISTIC_FAVOURITE_ID = -1;

/** Optimistic toggle: flip the cached list now, roll back on error, reconcile on settle. */
export function useToggleFavourite() {
  const queryClient = useQueryClient();

  return useMutation({
    // addFavourite's returned id is deliberately dropped — onSettled refetches the real one.
    mutationFn: async ({ imageId, favouriteId }: ToggleInput) => {
      if (favouriteId === null) {
        await addFavourite(imageId);
      } else {
        await removeFavourite(favouriteId);
      }
    },

    onMutate: async ({ imageId, favouriteId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favourites });
      const previous = queryClient.getQueryData<Favourite[]>(queryKeys.favourites);

      queryClient.setQueryData<Favourite[]>(queryKeys.favourites, (current = []) =>
        favouriteId === null
          ? [...current, { id: OPTIMISTIC_FAVOURITE_ID, image_id: imageId }]
          : current.filter((favourite) => favourite.id !== favouriteId),
      );

      return { previous };
    },

    onError: (_error, _input, context) => {
      if (context) {
        queryClient.setQueryData(queryKeys.favourites, context.previous);
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.favourites }),
  });
}
