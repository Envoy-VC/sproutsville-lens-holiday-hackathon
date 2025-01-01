import { useState } from 'react';

import { cn } from '~/lib/utils';

import { useNavigate } from '@tanstack/react-router';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useDisconnect } from 'wagmi';

export const HomeMenu = () => {
  const navigate = useNavigate();

  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const items = [
    {
      name: 'Play',
      key: 'play',
      onClick: async () => {
        await navigate({
          to: '/play',
        });
      },
    },
    {
      name: 'Profile',
      key: 'profile',
      onClick: () => {},
    },
    {
      name: 'Settings',
      key: 'settings',
      onClick: () => true,
    },
    {
      name: 'Sign Out',
      key: 'sign-out',
      onClick: async () => {
        await disconnectAsync();
      },
    },
  ];

  const [hovered, setHovered] = useState<string | null>(null);

  if (!address)
    return (
      <div className='mx-auto w-fit border'>
        <ConnectKitButton />
      </div>
    );

  return (
    <div className='isolate mx-auto flex w-full max-w-sm flex-col items-center rounded-[4rem] bg-white/30 pt-12 pb-6 ring-2 ring-black/10'>
      {items.map((item) => (
        <button
          key={item.key}
          type='button'
          className={cn(
            'py-2 font-minecraftia text-5xl font-black transition-all duration-200 ease-in-out',
            (hovered ?? 'play') === item.key
              ? 'scale-[108%] text-neutral-900'
              : 'scale-100 text-neutral-800'
          )}
          onClick={item.onClick}
          onMouseEnter={() => setHovered(item.key)}
          onMouseLeave={() => setHovered(null)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
