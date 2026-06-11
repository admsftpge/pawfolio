import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { listFavourites } from '@/api/favourites';
import { listMyImages } from '@/api/images';
import { listAllVotes } from '@/api/votes';
import { buildCatCards } from '@/data/cat-cards';

export const queryKeys = {
  images: ['images'],
  favourites: ['favourites'],
  votes: ['votes'],
} as const;

export function useCats() {
  const images = useQuery({ queryKey: queryKeys.images, queryFn: listMyImages });
  const favourites = useQuery({ queryKey: queryKeys.favourites, queryFn: listFavourites });
  const votes = useQuery({ queryKey: queryKeys.votes, queryFn: listAllVotes });

  // Images are the screen's content; favourites and votes only decorate it, so
  // their failures degrade (no hearts / score 0) instead of hiding the grid.
  const cats = useMemo(
    () =>
      images.data
        ? buildCatCards(images.data, favourites.data ?? [], votes.data ?? [])
        : undefined,
    [images.data, favourites.data, votes.data],
  );

  return {
    cats,
    isLoading: images.isPending || favourites.isPending || votes.isPending,
    error: images.error,
    refetch: () =>
      Promise.all([images.refetch(), favourites.refetch(), votes.refetch()]),
  };
}
