import { createFileRoute } from '@tanstack/react-router';
import { HomeMenu } from '~/components';

import { GameContainer } from '~/components/game';

export const GamePage = () => {
  return <GameContainer />;
};

export const Route = createFileRoute('/play')({
  component: GamePage,
});
