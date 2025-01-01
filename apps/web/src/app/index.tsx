import { useRef, useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { useOnClickOutside } from 'usehooks-ts';
import { HomeMenu } from '~/components';

export const HomeComponent = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    setGameStarted(true);
  });

  return (
    <div className='!m-0 !p-0'>
      <img
        alt='background'
        className='absolute h-screen w-full'
        src='/background.png'
      />
      <div className='absolute top-[8%] right-1/2 z-[1] translate-x-1/2'>
        <img alt='logo' className='max-w-xl' src='/logo-text.png' />
      </div>
      <div className='absolute right-1/2 bottom-1/4 z-[1] w-full max-w-xl translate-x-1/2'>
        {!gameStarted ? (
          <div
            ref={ref}
            className='rounded-md bg-white/20 p-4 pb-1 font-minecraftia font-black text-neutral-900'
          >
            Click anywhere on the screen to start the game
          </div>
        ) : (
          <HomeMenu />
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
