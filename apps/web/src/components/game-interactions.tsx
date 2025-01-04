import { observer } from 'mobx-react-lite';
import { gameState } from '~/game/state';

// import { GameButton } from './game-button';
import { GameDialog } from './game-dialog';

// import { IconButton } from './icon-button';

export const GameInteractions = observer(() => {
  const setIsOpen = (isOpen: boolean) => {
    gameState.setInteractionModalOpen(isOpen, 'onboarding');
  };

  return (
    <div className='absolute right-10 bottom-10'>
      <GameDialog
        isOpen={gameState.isInteractionModalOpen}
        setIsOpen={setIsOpen}
      >
        <div className='hide-scrollbar mx-auto flex max-w-md flex-col gap-4 pt-8'>
          {gameState.interactionType}
        </div>
      </GameDialog>
    </div>
  );
});
