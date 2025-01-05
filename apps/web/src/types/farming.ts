export const allCrops = [
  'wheat',
  'rice',
  'barley',
  'peas',
  'carrots',
  'tomatoes',
  'potatoes',
  'cabbage',
  'onions',
  'cauliflower',
] as const;
export const allSeeds = [
  'wheat_seed',
  'rice_seed',
  'barley_seed',
  'peas_seed',
  'carrots_seed',
  'tomatoes_seed',
  'potatoes_seed',
  'cabbage_seed',
  'onions_seed',
  'cauliflower_seed',
] as const;

export const allSeasons = ['spring', 'summer', 'autumn', 'winter'] as const;

export type CropType = (typeof allCrops)[number];
export type SeedType = (typeof allSeeds)[number];
export type Season = (typeof allSeasons)[number];

export interface Crop {
  name: CropType;
  seedName: string;
  season: Season;
  quality: 'low' | 'medium' | 'high'; // Higher quality = higher profit
  yieldVariance: {
    min: number; // Minimum yield per seed
    max: number; // Maximum yield per seed
  };
  seasonalBoost: {
    idealWeather: Season[]; // Boosts growth if the weather matches
    growthSpeedMultiplier: number; // Example: 1.2x speed in rainy weather
  };
  // Growth Stage as per time elapsed [start, end]
  growthStages: {
    growing: [number, number];
    readyToHarvest: [number, number];
    // end for Dead is Infinity and start is the same as readyToHarvest end
    dead: [number, number];
  };
  // Watering requirement between growing and readyToHarvest
  wateringRequirement: {
    frequency: number;
  };
  rotationBenefit: {
    after: CropType; // If this crop is planted before this crop
    percentageMultiplier: number; // Example: 1.2x yield if planted after wheat
  }[];
}
