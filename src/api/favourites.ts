import { z } from 'zod';

import { catApi } from '@/api/client';
import { config } from '@/api/config';

const favouriteSchema = z.object({
  id: z.number(),
  image_id: z.string(),
});

export type Favourite = z.infer<typeof favouriteSchema>;

export async function listFavourites(): Promise<Favourite[]> {
  const response = await catApi.get('/favourites', {
    params: { limit: config.catApiMaxPageSize },
  });
  return z.array(favouriteSchema).parse(response.data);
}

/** Returns the new favourite's id — needed later to unfavourite. */
export async function addFavourite(imageId: string): Promise<number> {
  const response = await catApi.post('/favourites', { image_id: imageId });
  return z.object({ id: z.number() }).parse(response.data).id;
}

export async function removeFavourite(favouriteId: number): Promise<void> {
  await catApi.delete(`/favourites/${favouriteId}`);
}
