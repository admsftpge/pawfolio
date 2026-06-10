import { addFavourite, Favourite, removeFavourite } from '@/api/favourites';
import { queryKeys } from '@/hooks/use-cats';
import { useOptimisticListMutation } from '@/hooks/use-optimistic-list-mutation';

type ToggleInput = {
  imageId: string;
  favouriteId: number | null;
};

// Stand-in id until the refetch brings the real one; never sent to the API.
const OPTIMISTIC_FAVOURITE_ID = -1;

export function useToggleFavourite() {
  return useOptimisticListMutation<ToggleInput, Favourite>({
    queryKey: queryKeys.favourites,

    // addFavourite's returned id is deliberately dropped — the reconciling
    // refetch brings the real one.
    mutationFn: async ({ imageId, favouriteId }) => {
      if (favouriteId === null) {
        await addFavourite(imageId);
      } else {
        await removeFavourite(favouriteId);
      }
    },

    update: (favourites, { imageId, favouriteId }) =>
      favouriteId === null
        ? [...favourites, { id: OPTIMISTIC_FAVOURITE_ID, image_id: imageId }]
        : favourites.filter((favourite) => favourite.id !== favouriteId),
  });
}
