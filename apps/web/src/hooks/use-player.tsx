import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { cropDetails } from '~/data/crops';
import * as Actions from '~/drizzle/actions';
import { playerEmitter } from '~/game/event-emitter';
import { gameState } from '~/game/state';

import type { CropType } from '../types/farming';

const isBetween = (x: number, [a, b]: [number, number]) => {
  return x >= a && x <= b;
};

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

  const { data: plantedCrops, refetch: refetchPlantedCrops } = useQuery({
    queryKey: ['plantedCrops', address],
    queryFn: async () => {
      if (!address) {
        throw new Error('No address found');
      }
      const pending = await Actions.getPendingCrops(address);

      const crops = pending.map((crop) => {
        let status: 'growing' | 'ready' | 'dead';
        const plantedAt = crop.plantedAt.getTime();
        const now = Date.now();
        const growTime = cropDetails[crop.cropId].growthStages.growing[1];
        const isGrowing = isBetween(now, [plantedAt, plantedAt + growTime]);

        const harvestTime =
          plantedAt + cropDetails[crop.cropId].growthStages.readyToHarvest[1];
        const isReady = isBetween(now, [plantedAt + growTime, harvestTime]);
        const isDead = isBetween(now, [harvestTime, Infinity]);

        if (isDead) {
          status = 'dead';
        } else if (isReady) {
          status = 'ready';
        } else if (isGrowing) {
          status = 'growing';
        } else {
          status = 'growing';
        }

        let nextPhaseIn;
        if (status === 'growing') {
          nextPhaseIn =
            crop.plantedAt.getTime() +
            cropDetails[crop.cropId].growthStages.growing[1] -
            Date.now();
        } else if (status === 'ready') {
          nextPhaseIn =
            crop.plantedAt.getTime() +
            cropDetails[crop.cropId].growthStages.readyToHarvest[1] -
            Date.now();
        } else {
          nextPhaseIn = 0;
        }

        return {
          ...crop,
          status,
          nextPhaseIn,
        };
      });

      const readyCrops = crops.filter((crop) => crop.status === 'ready');
      const notReadyCrops = crops.filter((crop) => crop.status === 'growing');
      const deadCrops = crops.filter((crop) => crop.status === 'dead');

      // TODO: Emit
      playerEmitter.emit(
        'placeCrops',
        readyCrops.map((crop) => {
          return {
            type: crop.cropId,
            tiles: crop.tiles,
          };
        })
      );
      return {
        all: crops,
        ready: readyCrops,
        notReady: notReadyCrops,
        dead: deadCrops,
      };
    },
    enabled: Boolean(address),
    initialData: {
      all: [],
      ready: [],
      notReady: [],
      dead: [],
    },
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

  const plantCrop = async (crop: {
    type: CropType;
    tiles: { x: number; y: number }[];
  }) => {
    try {
      if (!address) {
        throw new Error('No address found');
      }
      await Actions.plantCrop(address, crop.type, crop.tiles);
      gameState.setAvailableFarmTiles([]);
      await refetchPlantedCrops();
      await refetchInventory();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const claimDailyReward = async () => {
    if (!address) return;
    await Actions.claimDailyReward(address);
    await refetchPreviousClaims();
    await refetchInventory();
  };

  const harvestCrop = async (id: number) => {
    try {
      if (!address) {
        throw new Error('No address found');
      }
      await Actions.harvestCrop(address, id);
      await refresh();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const refresh = async () => {
    await refetchPreviousClaims();
    await refetchPlantedCrops();
    await refetchInventory();
  };

  return {
    claims,
    claimDailyReward,
    inventory,
    plantedCrops,
    plantCrop,
    harvestCrop,
    refresh,
  };
};
