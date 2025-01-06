/* eslint-disable @typescript-eslint/no-unsafe-assignment -- safe */
import { useApolloClient } from '@apollo/client';
import { evmAddress } from '@lens-protocol/client';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { MainContentFocus } from '~/__generated__/graphql';

import { Constants } from '../constants';
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
    refetchInterval: 3000,
    queryFn: async () => {
      const posts = await apollo.query({
        query: TIMELINE_QUERY,
        variables: {
          filter: {
            metadata: { mainContentFocus: [MainContentFocus.TextOnly] },
          },
          // Global Feed
          forFeeds: [evmAddress(Constants.SPROUTSVILLE_FEED_ADDRESS)],
        },
      });

      if (posts.error) {
        return [];
      }

      const data = posts.data.posts.items
        .map((post) => {
          if (post.__typename === 'Post') {
            const localName = post.author.username?.localName;
            const namespace = post.author.username?.namespace.namespace;
            const completeName =
              localName && namespace
                ? `${localName}/${namespace}`
                : post.author.metadata?.name;
            const author = {
              address: post.author.address as string,
              localName,
              namespace,
              completeName,
            };
            const content =
              post.metadata.__typename === 'TextOnlyMetadata'
                ? (post.metadata.content as string)
                : '';

            return {
              id: post.id as string,
              author,
              content,
              createdAt: post.timestamp,
              stats: post.stats,
            };
          }
          return null;
        })
        .filter((p) => p !== null);
      return data;
    },
    enabled: Boolean(address),
  });

  return { posts, isLoading, error };
};
