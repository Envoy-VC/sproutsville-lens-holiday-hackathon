import type { PropsWithChildren } from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const ENDPOINT = 'https://api.testnet.lens.dev/graphql';

export const client = new ApolloClient({
  uri: ENDPOINT,
  cache: new InMemoryCache(),
});

export const GraphQLProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
