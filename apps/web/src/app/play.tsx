import { createFileRoute } from '@tanstack/react-router';
import {
  GameButton,
  GameDialog,
  IconButton,
  TeleportButton,
} from '~/components';
import { playerEmitter } from '~/game/event-emitter';
import { Position } from '~/game/helpers/constants';

import { GameContainer } from '~/components/game';

export const GamePage = () => {
  return (
    <div>
      <TeleportButton />
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/play')({
  component: GamePage,
});
