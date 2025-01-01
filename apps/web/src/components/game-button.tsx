import React, { ComponentProps } from 'react';

import { cn } from '~/lib/utils';

interface GameButtonProps extends ComponentProps<'button'> {
  innerClassName?: string;
}

export const GameButton = ({
  className,
  children,
  type = 'button',
  innerClassName,
  ...props
}: GameButtonProps) => {
  return (
    <button
      type={type}
      className={cn('hover:translate-y-1', className)}
      {...props}
    >
      <div className='game-button relative flex h-full w-full cursor-pointer items-center justify-center bg-cover bg-center bg-no-repeat focus:outline-none'>
        {children && (
          <span className={cn('pointer-events-none z-10', innerClassName)}>
            {children}
          </span>
        )}
      </div>
    </button>
  );
};
