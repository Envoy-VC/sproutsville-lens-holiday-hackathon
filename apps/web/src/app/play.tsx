import { createFileRoute } from '@tanstack/react-router';
import { playerEmitter } from '~/game/event-emitter';

import { GameContainer } from '~/components/game';

export const GamePage = () => {
  return (
    <div>
      <div className='absolute top-44 right-4'>
        <button
          type='button'
          onClick={() =>
            playerEmitter.emit('teleport', { tileX: 10, tileY: 10 })
          }
        >
          Teleport
        </button>
      </div>
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/play')({
  component: GamePage,
});
