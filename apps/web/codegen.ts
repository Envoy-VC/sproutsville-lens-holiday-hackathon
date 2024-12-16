import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://api.testnet.lens.dev/graphql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

// eslint-disable-next-line import/no-default-export -- required for codegen
export default config;
