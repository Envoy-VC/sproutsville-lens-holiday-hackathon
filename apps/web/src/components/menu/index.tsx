import { useState } from 'react';

import { cn } from '~/lib/utils';

import { GameDialog } from '../game-dialog';
import { IconButton } from '../icon-button';
import { Inventory } from './inventory';
import { PlayerDetails } from './player-details';
import { Settings } from './settings';

const tabs = [
  {
    key: 'player',
    title: 'Player',
    icon: 'heart',
    iconCls: 'h-20 w-20',
  },
  {
    key: 'inventory',
    title: 'Inventory',
    icon: 'bag',
    iconCls: 'h-24 w-24',
  },
  {
    key: 'settings',
    title: 'Settings',
    icon: 'cog-wheel',
    iconCls: 'h-12 w-12',
  },
] as const;

export const MenuButton = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]['key']>('settings');
  const [hoveredTab, setHoveredTab] = useState<
    (typeof tabs)[number]['key'] | null
  >(null);

  return (
    <div className='absolute top-4 right-4'>
      <GameDialog
        contentCls='max-w-5xl '
        isOpen={open}
        setIsOpen={setOpen}
        showCloseButton={false}
        outsideElement={
          <div className='fixed top-[50%] left-[50%] z-[52] grid aspect-video w-full max-w-5xl translate-x-[-50%] translate-y-[-50%]'>
            <div className='absolute -top-8 left-16 flex flex-row items-center'>
              {tabs.map((tab) => {
                return (
                  <div
                    key={tab.key}
                    className={cn(
                      'relative flex h-20 w-32 flex-row items-center justify-center transition-all duration-200 ease-[step(2)]',
                      activeTab === tab.key ? '-translate-y-8' : '',
                      hoveredTab === tab.key ? '-translate-y-8' : ''
                    )}
                  >
                    <img
                      alt='Arch'
                      className='absolute !z-[5] h-32 w-32 object-cover'
                      src='/ui/frame-arch.png'
                    />

                    <img
                      alt='Arch'
                      className={cn('!z-[6] object-cover', tab.iconCls)}
                      src={`/ui/${tab.icon}.png`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        }
        trigger={
          <IconButton className='h-12 w-12 cursor-pointer' icon='menu' />
        }
      >
        <div className='absolute -top-16 left-16 flex flex-row items-center'>
          {tabs.map((tab) => {
            return (
              <button
                key={tab.key}
                className='h-20 w-32'
                type='button'
                onClick={() => {
                  setActiveTab(tab.key);
                }}
                onMouseEnter={() => {
                  setHoveredTab(tab.key);
                  console.log('hoveredTab', hoveredTab);
                }}
                onMouseLeave={() => {
                  setHoveredTab(null);
                  console.log('hoveredTab', hoveredTab);
                }}
              />
            );
          })}
        </div>
        <div className='h-full px-8 py-4'>
          {activeTab === 'player' && <PlayerDetails />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </GameDialog>
    </div>
  );
};
