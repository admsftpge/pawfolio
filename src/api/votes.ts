import * as Crypto from 'expo-crypto';
import { z } from 'zod';

import { catApi } from '@/api/client';
import { config } from '@/api/config';

const voteSchema = z.object({
  id: z.number(),
  image_id: z.string(),
  value: z.number(),
});

export type Vote = z.infer<typeof voteSchema>;

export async function listAllVotes(): Promise<Vote[]> {
  const votes: Vote[] = [];

  for (let page = 0; ; page++) {
    const response = await catApi.get('/votes', {
      params: { limit: config.catApiMaxPageSize, page },
      scopeToUser: false,
    });
    const batch = z.array(voteSchema).parse(response.data);
    votes.push(...batch);
    if (batch.length < config.catApiMaxPageSize) return votes;
  }
}

export async function addVote(imageId: string, value: 1 | -1): Promise<void> {
  // A unique sub_id per tap so the API keeps every vote (it upserts per sub_id),
  // letting the score climb instead of capping at one vote per user.
  await catApi.post(
    '/votes',
    { image_id: imageId, sub_id: Crypto.randomUUID(), value },
    { scopeToUser: false },
  );
}
