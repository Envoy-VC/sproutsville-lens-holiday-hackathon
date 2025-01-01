import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { GameButton } from './game-button';

interface GameDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
}

export const GameDialog = ({
  isOpen,
  setIsOpen,
  trigger,
  children,
}: GameDialogProps) => {
  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>
        {trigger ? (
          trigger
        ) : (
          <GameButton innerClassName='font-minecraftia' className='h-16 w-36'>
            Open
          </GameButton>
        )}
      </DialogTrigger>
      <DialogContent className='game-dialog aspect-video w-full max-w-2xl border-none bg-transparent'>
        <div className='z-10 mx-6 my-4'>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
