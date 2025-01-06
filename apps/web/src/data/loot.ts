import { type ItemType } from '~/drizzle/schema';

export const lootTable: Record<
  number,
  {
    item: ItemType;
    quantity: number;
  }[]
> = {
  0: [
    { item: 'carrots', quantity: 2 },
    { item: 'carrots_seed', quantity: 1 },
    { item: 'coin', quantity: 5 },
  ],
  1: [
    { item: 'carrots', quantity: 3 },
    { item: 'carrots_seed', quantity: 2 },
    { item: 'coin', quantity: 10 },
    { item: 'tomatoes_seed', quantity: 1 },
  ],
  2: [
    { item: 'carrots', quantity: 5 },
    { item: 'tomatoes', quantity: 2 },
    { item: 'carrots_seed', quantity: 3 },
    { item: 'tomatoes_seed', quantity: 2 },
    { item: 'coin', quantity: 15 },
  ],
  3: [
    { item: 'carrots', quantity: 7 },
    { item: 'tomatoes', quantity: 4 },
    { item: 'potatoes_seed', quantity: 2 },
    { item: 'carrots_seed', quantity: 4 },
    { item: 'coin', quantity: 25 },
  ],
  4: [
    { item: 'carrots', quantity: 10 },
    { item: 'tomatoes', quantity: 5 },
    { item: 'potatoes', quantity: 2 },
    { item: 'potatoes_seed', quantity: 3 },
    { item: 'coin', quantity: 40 },
  ],
  5: [
    { item: 'carrots', quantity: 12 },
    { item: 'tomatoes', quantity: 8 },
    { item: 'potatoes', quantity: 4 },
    { item: 'potatoes_seed', quantity: 4 },
    { item: 'carrots_seed', quantity: 5 },
    { item: 'coin', quantity: 60 },
  ],
  6: [
    { item: 'carrots', quantity: 15 },
    { item: 'tomatoes', quantity: 10 },
    { item: 'potatoes', quantity: 7 },
    { item: 'potatoes_seed', quantity: 5 },
    { item: 'carrots_seed', quantity: 6 },
    { item: 'tomatoes_seed', quantity: 5 },
    { item: 'coin', quantity: 100 },
  ],
};
