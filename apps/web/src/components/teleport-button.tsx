import { useState } from 'react';

import { playerEmitter } from '~/game/event-emitter';
import { Position } from '~/game/helpers/constants';

import { GameButton } from './game-button';
import { GameDialog } from './game-dialog';
import { IconButton } from './icon-button';

export const TeleportButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className='absolute right-4 bottom-4'>
      <GameDialog
        isOpen={open}
        setIsOpen={setOpen}
        trigger={
          <GameButton
            className='h-16 w-48'
            innerClassName='text-base font-minecraftia pt-3'
          >
            Teleport
          </GameButton>
        }
      >
        <div className='pt-4 text-center font-minecraftia text-3xl font-black'>
          Teleport Station
        </div>
        <div className='hide-scrollbar mx-auto flex max-w-md flex-col gap-4 pt-8'>
          {Object.values(Position).map((position) => {
            return (
              <div
                key={position.title}
                className='flex w-full max-w-lg flex-row items-center justify-between'
              >
                <div className='font-minecraftia text-xl'>{position.title}</div>
                <IconButton
                  icon='check'
                  onClick={() => {
                    playerEmitter.emit('teleport', {
                      tileX: position.x,
                      tileY: position.y,
                    });
                    setOpen(false);
                  }}
                />
              </div>
            );
          })}
        </div>
      </GameDialog>
    </div>
  );
};
