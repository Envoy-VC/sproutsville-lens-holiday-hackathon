import React, { ComponentProps } from 'react';

import { cn } from '~/lib/utils';

interface IconButtonProps extends ComponentProps<'button'> {
  innerClassName?: string;
  icon: string;
}

export const IconButton = ({
  className,
  children,
  type = 'button',
  innerClassName,
  icon,
  ...props
}: IconButtonProps) => {
  const imgUrl = `/ui/${icon}.png`;
  const alt = icon
    .split('')
    .map((char, index) => {
      if (index === 0) return char.toUpperCase();
      if (char === '-') return ' ';
      if (char === '.') return '';
      return char;
    })
    .join(' ');

  return (
    <button
      type={type}
      className={cn(
        'cursor-pointer !shadow-2xl hover:translate-y-1',
        className
      )}
      {...props}
    >
      <img src={imgUrl} alt={alt} className='h-8 w-8' />
      <span className='sr-only'>{alt}</span>
    </button>
  );
};
