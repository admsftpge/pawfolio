import { Favourite } from '@/api/favourites';
import { CatImage } from '@/api/images';
import { Vote } from '@/api/votes';

export type CatCard = CatImage & {
  favouriteId: number | null;
  score: number;
};

export function buildCatCards(
  images: CatImage[],
  favourites: Favourite[],
  votes: Vote[],
): CatCard[] {
  const favouriteIdByImage = new Map(favourites.map((f) => [f.image_id, f.id]));

  const scoreByImage = new Map<string, number>();
  for (const vote of votes) {
    scoreByImage.set(vote.image_id, (scoreByImage.get(vote.image_id) ?? 0) + vote.value);
  }

  return images.map((image) => ({
    ...image,
    favouriteId: favouriteIdByImage.get(image.id) ?? null,
    score: scoreByImage.get(image.id) ?? 0,
  }));
}
