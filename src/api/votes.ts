import { z } from 'zod';

import { catApi } from '@/api/client';
import { config } from '@/api/config';

const voteSchema = z.object({
  id: z.number(),
  image_id: z.string(),
  value: z.number(),
});

export type Vote = z.infer<typeof voteSchema>;

// Votes are unbounded rows (every tap adds one), so the score
// would silently cap out without paging through them all.
export async function listAllVotes(): Promise<Vote[]> {
  const votes: Vote[] = [];

  for (let page = 0; ; page++) {
    const response = await catApi.get('/votes', {
      params: { limit: config.catApiMaxPageSize, page },
    });
    const batch = z.array(voteSchema).parse(response.data);
    votes.push(...batch);
    if (batch.length < config.catApiMaxPageSize) return votes;
  }
}

export async function addVote(imageId: string, value: 1 | -1): Promise<void> {
  await catApi.post('/votes', { image_id: imageId, value });
}
