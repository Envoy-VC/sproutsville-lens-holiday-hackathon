import { createFileRoute } from '@tanstack/react-router';
import { CreateAppButton, TeleportButton } from '~/components';

import { GameContainer } from '~/components/game';

export const GamePage = () => {
  return (
    <div>
      <TeleportButton />
      <CreateAppButton />
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/play')({
  component: GamePage,
});
