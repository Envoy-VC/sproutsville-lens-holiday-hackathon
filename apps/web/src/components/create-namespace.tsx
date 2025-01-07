import { useLensNamespace } from '~/lib/lens';

import { GameButton } from './game-button';

export const CreateNamespaceButton = () => {
  const { createNamespace } = useLensNamespace();

  return (
    <div className='absolute top-4 left-4'>
      <GameButton
        className='h-16 w-48'
        innerClassName='text-base font-minecraftia pt-3'
        onClick={async () => {
          await createNamespace();
        }}
      >
        Plant
      </GameButton>
    </div>
  );
};
