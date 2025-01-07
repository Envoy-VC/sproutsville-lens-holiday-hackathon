import { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { toast } from 'sonner';
import { cropDetails } from '~/data/crops';
import { type Crop } from '~/drizzle/schema';
import { playerEmitter } from '~/game/event-emitter';
import { usePlayer } from '~/hooks';

import { GameButton } from '~/components/game-button';
import { Slider } from '~/components/ui/slider';

import { gameState } from '../../game/state/index';

import type { CropType } from '~/types/farming';

export const FarmInteraction = observer(() => {
  const { refresh } = usePlayer();
  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <div className='flex h-full w-full flex-row gap-3 p-4'>
        <PlantCrops />
        <div className='h-full rounded-2xl border-2 border-[#6B5052]' />
        <HarvestCrops />
      </div>
      <GameButton
        className='h-16 w-64 disabled:opacity-50'
        innerClassName='text-base font-minecraftia pt-3'
        onClick={async () => {
          await refresh();
        }}
      >
        Refresh
      </GameButton>
    </div>
  );
});

const HarvestCrops = observer(() => {
  const { plantedCrops } = usePlayer();
  return (
    <div className='flex basis-1/2 flex-col gap-4'>
      <div className='text-center font-minecraftia text-2xl font-black'>
        Harvest Crops
      </div>
      {[...plantedCrops.notReady].map((crop) => {
        return <NotReadyCrop key={crop.cropId} crop={crop} />;
      })}
      {[...plantedCrops.ready].map((crop) => {
        return <ReadyCrop key={crop.cropId} crop={crop} />;
      })}
      {[...plantedCrops.dead].map((crop) => {
        return <Dead key={crop.cropId} crop={crop} />;
      })}
    </div>
  );
});

const NotReadyCrop = observer(
  ({
    crop,
  }: {
    crop: Crop & {
      status: 'growing' | 'ready' | 'dead';
      nextPhaseIn: number;
    };
  }) => {
    // start a timer for when the crop is ready
    const [readyIn, setReadyIn] = useState<number>(crop.nextPhaseIn);
    // Timer X Hr X Min X Sec
    useEffect(() => {
      const interval = setInterval(() => {
        setReadyIn(readyIn - 1000);
      }, 1000);

      return () => clearInterval(interval);
    }, [readyIn]);

    const formattedTime = new Date(readyIn).toISOString().substring(11, 19);

    return (
      <div className='flex flex-row items-center gap-4'>
        <img
          alt={crop.cropId}
          className='h-12 w-12'
          src={`/ui/${crop.cropId}.png`}
        />

        <div className='text-center font-minecraftia text-sm font-black'>
          x{crop.tiles.length}
        </div>
        <GameButton
          disabled
          className='h-16 w-72 disabled:opacity-50'
          innerClassName='text-base font-minecraftia pt-3'
        >
          {formattedTime}
        </GameButton>
      </div>
    );
  }
);

const ReadyCrop = observer(
  ({
    crop,
  }: {
    crop: Crop & {
      status: 'growing' | 'ready' | 'dead';
      nextPhaseIn: number;
    };
  }) => {
    const { harvestCrop } = usePlayer();

    return (
      <div className='flex flex-row items-center gap-4'>
        <img
          alt={crop.cropId}
          className='h-12 w-12'
          src={`/ui/${crop.cropId}.png`}
        />

        <div className='text-center font-minecraftia text-sm font-black'>
          x{crop.tiles.length}
        </div>
        <GameButton
          className='h-16 w-72 disabled:opacity-50'
          innerClassName='text-base font-minecraftia pt-3'
          onClick={async () => {
            await harvestCrop(crop.id);
          }}
        >
          Harvest
        </GameButton>
      </div>
    );
  }
);
const Dead = observer(
  ({
    crop,
  }: {
    crop: Crop & {
      status: 'growing' | 'ready' | 'dead';
      nextPhaseIn: number;
    };
  }) => {
    const { harvestCrop } = usePlayer();

    return (
      <div className='flex flex-row items-center gap-4'>
        <img
          alt={crop.cropId}
          className='h-12 w-12 opacity-50'
          src={`/ui/${crop.cropId}.png`}
        />

        <div className='text-center font-minecraftia text-sm font-black'>
          x{crop.tiles.length}
        </div>
        <GameButton
          disabled
          className='h-16 w-72 disabled:opacity-50'
          innerClassName='text-base font-minecraftia pt-3'
          onClick={async () => {
            await harvestCrop(crop.id);
          }}
        >
          Harvest
        </GameButton>
      </div>
    );
  }
);

const PlantCrops = observer(() => {
  const { plantedCrops, plantCrop } = usePlayer();
  const [values, setValues] = useState<{
    carrots: number;
    tomatoes: number;
    potatoes: number;
  }>({
    carrots: 0,
    tomatoes: 0,
    potatoes: 0,
  });

  const onPlant = async () => {
    try {
      const all = Object.values(values).reduce((acc, curr) => acc + curr, 0);
      if (all > 107 - plantedCrops.all.length) {
        throw new Error('Not enough space');
      }

      for (const [type, amount] of Object.entries(values)) {
        const usedTiles = plantedCrops.all.map((crop) => crop.tiles).flat();
        playerEmitter.emit('getEmptyFarmTiles', {
          amount,
          used: usedTiles,
        });
        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });

        if (gameState.availableFarmTiles.length !== amount) {
          toast.error(
            `Not enough space for ${cropDetails[type as CropType].name}`
          );
          return;
        }

        await plantCrop({
          type: type as CropType,
          tiles: gameState.availableFarmTiles,
        }).catch((error: unknown) => {
          throw new Error((error as Error).message);
        });
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <div className='flex basis-1/2 flex-col gap-4'>
      <div className='w-full text-center font-minecraftia text-2xl font-black'>
        Plant Crops
      </div>
      {Object.entries(cropDetails).map(([type, crop]) => {
        return (
          <div key={type} className='flex flex-row items-center gap-4'>
            <img
              alt={crop.name}
              className='h-12 w-12'
              src={`/ui/${type}.png`}
            />
            <Slider
              className='w-[12rem]'
              max={107 - plantedCrops.all.length}
              step={1}
              value={[values[type as CropType]]}
              onValueChange={(value) => {
                setValues((prev) => ({ ...prev, [type]: value[0] }));
              }}
            />
            <div className='text-center font-minecraftia text-sm font-black'>
              x{values[type as CropType]}
            </div>
          </div>
        );
      })}
      <GameButton
        className='h-16 w-72'
        innerClassName='text-base font-minecraftia pt-3'
        onClick={onPlant}
      >
        Plant Crops
      </GameButton>
    </div>
  );
});
