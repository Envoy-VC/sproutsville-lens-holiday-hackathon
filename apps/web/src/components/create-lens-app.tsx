import { useLensNamespace } from '~/lib/lens';

import { GameButton } from './game-button';

export const CreateLensAppButton = () => {
  const { createLensApp } = useLensNamespace();

  return (
    <div className='absolute top-4 right-4'>
      <GameButton
        className='h-16 w-48'
        innerClassName='text-base font-minecraftia pt-3'
        onClick={async () => {
          await createLensApp();
        }}
      >
        Create Lens App
      </GameButton>
    </div>
  );
};
