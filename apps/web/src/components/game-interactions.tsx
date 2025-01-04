import { observer } from 'mobx-react-lite';
import { gameState } from '~/game/state';

import { GameDialog } from './game-dialog';
import { InteractionContent } from './interactions';

export const GameInteractions = observer(() => {
  const setIsOpen = (isOpen: boolean) => {
    gameState.setInteractionModalOpen(isOpen, 'onboarding');
  };

  return (
    <div className='absolute right-10 bottom-10'>
      <GameDialog
        contentCls='max-w-3xl'
        isOpen={gameState.isInteractionModalOpen}
        setIsOpen={setIsOpen}
      >
        <InteractionContent interactionType={gameState.interactionType} />
      </GameDialog>
    </div>
  );
});
