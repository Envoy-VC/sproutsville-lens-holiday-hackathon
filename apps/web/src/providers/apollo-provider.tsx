import type { PropsWithChildren } from 'react';

import { client as lensClient } from '~/lib/lens';

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const ENDPOINT = 'https://api.testnet.lens.dev/graphql';

const httpLink = new HttpLink({
  uri: ENDPOINT,
});

const getToken = async () => {
  const res = await lensClient.context.storage.getItem(
    'lens.testnet.credentials'
  );
  if (!res) return 'null';
  const data = JSON.parse(res) as
    | {
        data: {
          accessToken: string;
        };
        metadata: {
          createdAt: number;
          updatedAt: number;
        };
      }
    | undefined;

  // check if 10 minutes have passed since the token was updated
  const now = new Date().getTime();
  if (data && now - data.metadata.updatedAt > 10 * 60 * 1000) {
    await lensClient.resumeSession();
    const s = await lensClient.context.storage.getItem(
      'lens.testnet.credentials'
    );
    const data = JSON.parse(s ?? '{}') as
      | {
          data: {
            accessToken: string;
          };
          metadata: {
            createdAt: number;
            updatedAt: number;
          };
        }
      | undefined;
    return data?.data.accessToken ?? '';
  }

  return data?.data.accessToken ?? '';
};

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- safe
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const GraphQLProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
