import { createFileRoute } from '@tanstack/react-router';
import { GameInteractions, MenuButton, TeleportButton } from '~/components';

import { GameContainer } from '~/components/game';

export const GamePage = () => {
  return (
    <div>
      <TeleportButton />
      <GameInteractions />
      <MenuButton />
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/play')({
  component: GamePage,
});
