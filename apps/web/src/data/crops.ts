import type { Crop } from '~/types/farming';

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;

export const crops: Crop[] = [
  {
    name: 'wheat',
    seedName: 'wheat_seed',
    season: 'spring',
    quality: 'medium',
    yieldVariance: {
      min: 3,
      max: 6,
    },
    seasonalBoost: {
      idealWeather: ['spring', 'autumn'],
      growthSpeedMultiplier: 1.2,
    },
    growthStages: {
      growing: [0, 5 * ONE_MINUTE], // Growing phase lasts 5 minutes
      readyToHarvest: [5 * ONE_MINUTE, 6 * ONE_HOUR], // Harvestable for 6 hours
      dead: [6 * ONE_HOUR, Infinity], // Dead after 6 hours
    },
    wateringRequirement: {
      frequency: 30 * ONE_MINUTE, // Needs watering every 30 minutes
    },
    rotationBenefit: [
      {
        after: 'barley',
        percentageMultiplier: 1.2,
      },
    ],
  },
  {
    name: 'rice',
    seedName: 'rice_seed',
    season: 'summer',
    quality: 'high',
    yieldVariance: {
      min: 4,
      max: 8,
    },
    seasonalBoost: {
      idealWeather: ['summer'],
      growthSpeedMultiplier: 1.3,
    },
    growthStages: {
      growing: [0, 10 * ONE_MINUTE], // Growing phase lasts 10 minutes
      readyToHarvest: [10 * ONE_MINUTE, 8 * ONE_HOUR], // Harvestable for 8 hours
      dead: [8 * ONE_HOUR, Infinity], // Dead after 8 hours
    },
    wateringRequirement: {
      frequency: 20 * ONE_MINUTE, // Needs watering every 20 minutes
    },
    rotationBenefit: [
      {
        after: 'peas',
        percentageMultiplier: 1.15,
      },
    ],
  },
  {
    name: 'barley',
    seedName: 'barley_seed',
    season: 'spring',
    quality: 'medium',
    yieldVariance: {
      min: 3,
      max: 7,
    },
    seasonalBoost: {
      idealWeather: ['spring', 'summer'],
      growthSpeedMultiplier: 1.1,
    },
    growthStages: {
      growing: [0, 8 * ONE_MINUTE], // Growing phase lasts 8 minutes
      readyToHarvest: [8 * ONE_MINUTE, 7 * ONE_HOUR], // Harvestable for 7 hours
      dead: [7 * ONE_HOUR, Infinity], // Dead after 7 hours
    },
    wateringRequirement: {
      frequency: 25 * ONE_MINUTE, // Needs watering every 25 minutes
    },
    rotationBenefit: [
      {
        after: 'wheat',
        percentageMultiplier: 1.2,
      },
    ],
  },
  {
    name: 'peas',
    seedName: 'peas_seed',
    season: 'spring',
    quality: 'high',
    yieldVariance: {
      min: 5,
      max: 9,
    },
    seasonalBoost: {
      idealWeather: ['spring', 'autumn'],
      growthSpeedMultiplier: 1.3,
    },
    growthStages: {
      growing: [0, 4 * ONE_MINUTE], // Growing phase lasts 4 minutes
      readyToHarvest: [4 * ONE_MINUTE, 5 * ONE_HOUR], // Harvestable for 5 hours
      dead: [5 * ONE_HOUR, Infinity], // Dead after 5 hours
    },
    wateringRequirement: {
      frequency: 15 * ONE_MINUTE, // Needs watering every 15 minutes
    },
    rotationBenefit: [
      {
        after: 'carrots',
        percentageMultiplier: 1.1,
      },
    ],
  },
  {
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
  {
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
    rotationBenefit: [
      {
        after: 'cabbage',
        percentageMultiplier: 1.2,
      },
    ],
  },
  {
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
    rotationBenefit: [
      {
        after: 'onions',
        percentageMultiplier: 1.1,
      },
    ],
  },
  {
    name: 'cabbage',
    seedName: 'cabbage_seed',
    season: 'winter',
    quality: 'low',
    yieldVariance: {
      min: 3,
      max: 4,
    },
    seasonalBoost: {
      idealWeather: ['winter'],
      growthSpeedMultiplier: 1.2,
    },
    growthStages: {
      growing: [0, 15 * ONE_MINUTE], // Growing phase lasts 15 minutes
      readyToHarvest: [15 * ONE_MINUTE, 8 * ONE_HOUR], // Harvestable for 8 hours
      dead: [8 * ONE_HOUR, Infinity], // Dead after 8 hours
    },
    wateringRequirement: {
      frequency: 40 * ONE_MINUTE, // Needs watering every 40 minutes
    },
    rotationBenefit: [
      {
        after: 'cauliflower',
        percentageMultiplier: 1.2,
      },
    ],
  },
  {
    name: 'onions',
    seedName: 'onion_seed',
    season: 'spring',
    quality: 'medium',
    yieldVariance: {
      min: 5,
      max: 8,
    },
    seasonalBoost: {
      idealWeather: ['spring', 'summer'],
      growthSpeedMultiplier: 1.15,
    },
    growthStages: {
      growing: [0, 10 * ONE_MINUTE], // Growing phase lasts 10 minutes
      readyToHarvest: [10 * ONE_MINUTE, 9 * ONE_HOUR], // Harvestable for 9 hours
      dead: [9 * ONE_HOUR, Infinity], // Dead after 9 hours
    },
    wateringRequirement: {
      frequency: 25 * ONE_MINUTE, // Needs watering every 25 minutes
    },
    rotationBenefit: [
      {
        after: 'barley',
        percentageMultiplier: 1.1,
      },
    ],
  },
  {
    name: 'cauliflower',
    seedName: 'cauliflower_seed',
    season: 'autumn',
    quality: 'medium',
    yieldVariance: {
      min: 4,
      max: 7,
    },
    seasonalBoost: {
      idealWeather: ['autumn', 'winter'],
      growthSpeedMultiplier: 1.3,
    },
    growthStages: {
      growing: [0, 8 * ONE_MINUTE], // Growing phase lasts 8 minutes
      readyToHarvest: [8 * ONE_MINUTE, 7 * ONE_HOUR], // Harvestable for 7 hours
      dead: [7 * ONE_HOUR, Infinity], // Dead after 7 hours
    },
    wateringRequirement: {
      frequency: 20 * ONE_MINUTE, // Needs watering every 20 minutes
    },
    rotationBenefit: [
      {
        after: 'carrots',
        percentageMultiplier: 1.1,
      },
    ],
  },
];
