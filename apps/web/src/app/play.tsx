import { createFileRoute } from '@tanstack/react-router';
import { CreateNamespaceButton, TeleportButton } from '~/components';

import { GameContainer } from '~/components/game';

export const GamePage = () => {
  return (
    <div>
      <TeleportButton />
      <CreateNamespaceButton />
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/play')({
  component: GamePage,
});
