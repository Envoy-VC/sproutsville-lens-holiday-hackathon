/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- safe */

/* eslint-disable jsx-a11y/click-events-have-key-events -- safe */
import { observer } from 'mobx-react-lite';
import { gameState } from '~/game/state';

export const Settings = observer(() => {
  return (
    <div className='h-full overflow-hidden p-6'>
      <div className='relative flex h-full items-center justify-center'>
        <img
          alt='Arch'
          className='bg-100-100 mx-auto aspect-video w-full max-w-xl scale-[200%]'
          src='/ui/tile.png'
        />
        <div className='absolute top-0 right-0 flex h-full w-full flex-row'>
          <div className='relative m-6 w-full'>
            <img alt='Frame' className='h-64 w-full' src='/ui/frame.png' />
            <div className='absolute top-1/4 left-1/2 flex -translate-x-1/2 flex-row gap-8'>
              <div className='flex flex-row items-center'>
                <img
                  alt='Volume'
                  className='h-18 w-18 -translate-y-1'
                  src={`/ui/volume-${gameState.sfx ? 'full' : 'off'}-icon.png`}
                />
                <img
                  alt='Switch'
                  className='h-16 w-32 -translate-x-4'
                  src={`/ui/switch-${gameState.sfx ? 'on' : 'off'}.png`}
                  onClick={() => {
                    gameState.toggleSfx();
                  }}
                />
              </div>
              <div className='flex flex-row items-center'>
                <img
                  alt='Music'
                  className='h-18 w-18 -translate-y-1'
                  src={`/ui/music-${gameState.music ? 'full' : 'off'}-icon.png`}
                />
                <img
                  alt='Switch'
                  className='h-16 w-32 -translate-x-4'
                  src={`/ui/switch-${gameState.music ? 'on' : 'off'}.png`}
                  onClick={() => {
                    gameState.toggleMusic();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
