import { toast } from 'sonner';
import { lootTable } from '~/data/loot';
import { usePlayer } from '~/hooks';

import { GameButton } from '../game-button';

export const DailyRewards = () => {
  const { claims, claimDailyReward } = usePlayer();

  const onClaim = async () => {
    try {
      await claimDailyReward();
      toast.success('Claimed Daily Reward');
    } catch (error: unknown) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };
  return (
    <div className='flex flex-col gap-6 pt-4'>
      <div className='text-center font-minecraftia text-3xl font-black'>
        Daily Login Rewards
      </div>
      <div className='flex w-full flex-row flex-wrap justify-center gap-2'>
        {Object.entries(lootTable).map(([day, items]) => {
          return (
            <div
              key={day}
              className='flex aspect-square w-full max-w-[10rem] flex-col justify-between rounded-md border-3 border-[#6B5052]'
            >
              <div>
                <div className='pt-4 text-center font-minecraftia text-xl font-black'>
                  Day {Number(day) + 1}
                </div>
                <div className='flex flex-row flex-wrap items-center justify-center gap-1 pt-4'>
                  {items.map((item, i) => {
                    return (
                      <div
                        key={`${String(i)}-item`}
                        className='flex flex-row gap-1'
                      >
                        <img
                          alt={item.item}
                          className='h-6 w-6 object-cover'
                          src={`/ui/${item.item}.png`}
                        />
                        <div className='pt-1 font-minecraftia text-sm font-black'>
                          x{item.quantity}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {claims.currentClaimDay === Number(day) ? (
                <GameButton
                  className='h-12 w-40 disabled:opacity-30'
                  innerClassName='text-base font-minecraftia pt-3'
                  onClick={onClaim}
                >
                  Claim
                </GameButton>
              ) : null}
              {claims.claims[Number(day)] ? (
                <GameButton
                  disabled
                  className='h-12 w-40 disabled:opacity-30'
                  innerClassName='text-base font-minecraftia pt-3'
                >
                  Claimed
                </GameButton>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
