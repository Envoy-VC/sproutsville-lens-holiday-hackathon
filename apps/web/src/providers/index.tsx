import type { PropsWithChildren } from 'react';

import { GraphQLProvider } from './apollo-provider';
import { QueryProvider } from './query-provider';
import { Web3Provider } from './web3-provider';

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <GraphQLProvider>
        <Web3Provider>{children}</Web3Provider>
      </GraphQLProvider>
    </QueryProvider>
  );
};
