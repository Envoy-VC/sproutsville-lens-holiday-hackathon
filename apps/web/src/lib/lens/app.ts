import { Platform, app } from '@lens-protocol/metadata';

export const appMetadata = app({
  name: 'Sproutsville',
  tagline: 'Sprout Your World, Connect Your Roots!',
  description:
    'In Sproutsville, build your farm while exploring the Lens ecosystem 🌱. Create a profile, share posts, and connect with others as you tend to your crops, raise animals, and customize your village 🏡.',
  logo: 'lens://0bcc313cb58656d4c1c46fb4514e743750635674038afbb8dc50e6eda305b2d6',
  developer: 'Vedant Chainani <vedantchainani1084@gmail.com>',
  url: 'https://sproutsville.vercel.app',
  termsOfService: 'https://sproutsville.vercel.app/terms',
  privacyPolicy: 'https://sproutsville.vercel.app/privacy',
  platforms: [Platform.WEB],
});
