import type { Crop, CropType } from '~/types/farming';

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = 60 * ONE_MINUTE;

export const cropDetails: Record<CropType, Crop> = {
  carrots: {
    name: 'carrots',
    seedName: 'carrot_seed',
    season: 'spring',
    quality: 'medium',
    yieldVariance: {
      min: 4,
      max: 6,
    },
    seasonalBoost: {
      idealWeather: ['spring'],
      growthSpeedMultiplier: 1.2,
    },
    growthStages: {
      growing: [0, 6 * ONE_MINUTE], // Growing phase lasts 6 minutes
      readyToHarvest: [6 * ONE_MINUTE, 7 * ONE_HOUR], // Harvestable for 7 hours
      dead: [7 * ONE_HOUR, Infinity], // Dead after 7 hours
    },
    wateringRequirement: {
      frequency: 20 * ONE_MINUTE, // Needs watering every 20 minutes
    },
    rotationBenefit: [
      {
        after: 'potatoes',
        percentageMultiplier: 1.15,
      },
    ],
  },
  tomatoes: {
    name: 'tomatoes',
    seedName: 'tomato_seed',
    season: 'summer',
    quality: 'high',
    yieldVariance: {
      min: 3,
      max: 5,
    },
    seasonalBoost: {
      idealWeather: ['summer'],
      growthSpeedMultiplier: 1.4,
    },
    growthStages: {
      growing: [0, 7 * ONE_MINUTE], // Growing phase lasts 7 minutes
      readyToHarvest: [7 * ONE_MINUTE, 6 * ONE_HOUR], // Harvestable for 6 hours
      dead: [6 * ONE_HOUR, Infinity], // Dead after 6 hours
    },
    wateringRequirement: {
      frequency: 30 * ONE_MINUTE, // Needs watering every 30 minutes
    },
    rotationBenefit: [],
  },
  potatoes: {
    name: 'potatoes',
    seedName: 'potato_seed',
    season: 'autumn',
    quality: 'medium',
    yieldVariance: {
      min: 6,
      max: 10,
    },
    seasonalBoost: {
      idealWeather: ['autumn'],
      growthSpeedMultiplier: 1.3,
    },
    growthStages: {
      growing: [0, 12 * ONE_MINUTE], // Growing phase lasts 12 minutes
      readyToHarvest: [12 * ONE_MINUTE, 10 * ONE_HOUR], // Harvestable for 10 hours
      dead: [10 * ONE_HOUR, Infinity], // Dead after 10 hours
    },
    wateringRequirement: {
      frequency: 35 * ONE_MINUTE, // Needs watering every 35 minutes
    },
    rotationBenefit: [],
  },
};
