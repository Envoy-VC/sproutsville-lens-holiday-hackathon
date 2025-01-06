import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import * as Actions from '~/drizzle/actions';

export const usePlayer = () => {
  const { address } = useAccount();
  const { data: previousClaims, refetch: refetchPreviousClaims } = useQuery({
    queryKey: ['previous-claim', address],
    queryFn: async () => {
      if (!address) {
        return [];
      }
      return await Actions.getPreviousRewardClaim(address);
    },
    enabled: Boolean(address),
    initialData: [],
  });

  const { data: inventory, refetch: refetchInventory } = useQuery({
    queryKey: ['inventory', address],
    queryFn: async () => {
      if (!address) {
        return [];
      }
      return await Actions.getInventory(address);
    },
    enabled: Boolean(address),
    initialData: [],
  });

  const claims = useMemo(() => {
    const lastClaim = previousClaims[previousClaims.length - 1];
    // Claims from Day 0 to last
    const claims = previousClaims.slice(
      previousClaims.length - 1 - (lastClaim?.dayNumber ?? 0),
      previousClaims.length
    );
    const canClaimNow =
      (lastClaim?.claimedAt.getTime() ?? Date.now()) - Date.now() < 86400000;
    let currentClaimDay;
    if (!lastClaim && canClaimNow) {
      currentClaimDay = 0;
    } else if (lastClaim && canClaimNow) {
      currentClaimDay = lastClaim.dayNumber === 6 ? 0 : lastClaim.dayNumber + 1;
    } else {
      currentClaimDay = null;
    }
    return {
      claims: claims.sort((a, b) => a.dayNumber - b.dayNumber),
      canClaimNow,
      currentClaimDay,
    };
  }, [previousClaims]);

  const claimDailyReward = async () => {
    if (!address) return;
    await Actions.claimDailyReward(address);
    await refetchPreviousClaims();
    await refetchInventory();
  };

  return { claims, claimDailyReward, inventory };
};
