import { useLensNamespace } from '~/lib/lens';

import { playerEmitter } from '~/game/event-emitter';

import { GameButton } from './game-button';

export const CreateNamespaceButton = () => {
  const { createNamespace } = useLensNamespace();

  return (
    <div className='absolute top-4 left-4'>
      <GameButton
        className='h-16 w-48'
        innerClassName='text-base font-minecraftia pt-3'
        onClick={() => {
          playerEmitter.emit('placeCrops', [{ type: 'carrots', tiles: 107 }]);
        }}
      >
        Plant
      </GameButton>
    </div>
  );
};
