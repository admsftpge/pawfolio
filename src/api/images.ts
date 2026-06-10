import { Platform } from 'react-native';
import { z } from 'zod';

import { catApi } from '@/api/client';
import { config } from '@/api/config';

const catImageSchema = z.object({
  id: z.string(),
  url: z.url(),
  width: z.number(),
  height: z.number(),
});

export type CatImage = z.infer<typeof catImageSchema>;

const uploadResponseSchema = z.object({
  id: z.string(),
  url: z.url(),
});

/** Newest first. TODO: paginate if a collection ever exceeds 100 cats. */
export async function listMyImages(): Promise<CatImage[]> {
  const response = await catApi.get('/images', {
    params: { limit: config.catApiMaxPageSize, order: 'DESC' },
  });
  return z.array(catImageSchema).parse(response.data);
}

// Callers normalise to JPEG first (see normalize-image.ts), so this always sends image/jpeg.
export async function uploadImage(uri: string) {
  const form = new FormData();

  if (Platform.OS === 'web') {
    // Browsers need the actual bytes as a Blob.
    const blob = await (await fetch(uri)).blob();
    form.append('file', blob, 'cat.jpg');
  } else {
    // React Native's FormData takes a {uri, name, type} descriptor instead of
    // a web Blob; the cast bridges the web-centric TS types.
    form.append('file', { uri, name: 'cat.jpg', type: 'image/jpeg' } as unknown as Blob);
  }

  const response = await catApi.post('/images/upload', form);
  return uploadResponseSchema.parse(response.data);
}

export async function deleteImage(imageId: string): Promise<void> {
  await catApi.delete(`/images/${imageId}`);
}
