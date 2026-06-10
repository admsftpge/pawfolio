import { describe, expect, it } from '@jest/globals';

import { buildCatCards } from '@/data/cat-cards';

import type { Favourite } from '@/api/favourites';
import type { CatImage } from '@/api/images';
import type { Vote } from '@/api/votes';

const image = (id: string): CatImage => ({
  id,
  url: `https://cdn.example.com/${id}.jpg`,
  width: 800,
  height: 600,
});

const favourite = (id: number, imageId: string): Favourite => ({
  id,
  image_id: imageId,
});

const vote = (id: number, imageId: string, value: number): Vote => ({
  id,
  image_id: imageId,
  value,
});

describe('buildCatCards', () => {
  it('returns an empty list when there are no images', () => {
    expect(buildCatCards([], [], [])).toEqual([]);
  });

  it('defaults to score 0 and no favourite when a cat has no matches', () => {
    const cards = buildCatCards([image('a')], [], []);

    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({ id: 'a', score: 0, favouriteId: null });
  });

  it('keeps the image fields on the card', () => {
    const [card] = buildCatCards([image('a')], [], []);

    expect(card).toMatchObject({
      url: 'https://cdn.example.com/a.jpg',
      width: 800,
      height: 600,
    });
  });

  it('sums mixed votes into upvotes minus downvotes', () => {
    const votes = [
      vote(1, 'a', 1),
      vote(2, 'a', 1),
      vote(3, 'a', -1),
      vote(4, 'a', 1),
    ];

    const [card] = buildCatCards([image('a')], [], votes);

    expect(card.score).toBe(2);
  });

  it('attaches the favourite id to the right cat only', () => {
    const cards = buildCatCards(
      [image('a'), image('b')],
      [favourite(42, 'b')],
      [],
    );

    expect(cards.find((c) => c.id === 'a')?.favouriteId).toBeNull();
    expect(cards.find((c) => c.id === 'b')?.favouriteId).toBe(42);
  });

  it('scores each cat independently', () => {
    const cards = buildCatCards(
      [image('a'), image('b')],
      [],
      [vote(1, 'a', 1), vote(2, 'b', -1), vote(3, 'b', -1)],
    );

    expect(cards.find((c) => c.id === 'a')?.score).toBe(1);
    expect(cards.find((c) => c.id === 'b')?.score).toBe(-2);
  });

  it('ignores favourites and votes pointing at unknown images', () => {
    const cards = buildCatCards(
      [image('a')],
      [favourite(1, 'deleted-cat')],
      [vote(1, 'deleted-cat', 1)],
    );

    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({ score: 0, favouriteId: null });
  });
});
