/* eslint-disable @typescript-eslint/no-unsafe-return -- safe */

/* eslint-disable @typescript-eslint/no-unsafe-assignment -- safe */
import { useApolloClient } from '@apollo/client';
import { evmAddress } from '@lens-protocol/client';
import { fetchAccountsAvailable } from '@lens-protocol/client/actions';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { MainContentFocus } from '~/__generated__/graphql';

import { client } from '../client';
import { TIMELINE_QUERY } from '../graphql';

export const useTimeline = () => {
  const { address } = useAccount();
  const apollo = useApolloClient();
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['timeline', address],
    queryFn: async () => {
      if (!address) return [];

      const res = await fetchAccountsAvailable(client, {
        managedBy: evmAddress(address),
        includeOwned: true,
      });

      if (res.isErr()) {
        console.error(res.error);
        return [];
      }

      if (!res.value?.items[0]) {
        return [];
      }

      const posts = await apollo.query({
        query: TIMELINE_QUERY,
        variables: {
          account: evmAddress(res.value.items[0].account.address as string),
          filter: {
            metadata: { mainContentFocus: [MainContentFocus.TextOnly] },
          },
          // Global Feed
          forFeeds: [evmAddress('0x83C8D9e96Da13aaD12E068F48C639C7671D2a5C7')],
        },
      });

      if (posts.error) {
        return [];
      }
      return posts.data;
    },
    enabled: Boolean(address),
  });

  return { posts, isLoading, error };
};
