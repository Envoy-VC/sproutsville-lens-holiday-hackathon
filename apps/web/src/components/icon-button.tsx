import type { ComponentProps } from 'react';

import { cn } from '~/lib/utils';

interface IconButtonProps extends ComponentProps<'button'> {
  innerClassName?: string;
  icon: string;
}

export const IconButton = ({
  className,
  type = 'button',
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
      // eslint-disable-next-line react/button-has-type -- safe
      type={type}
      className={cn(
        'h-8 w-8 cursor-pointer !shadow-2xl hover:translate-y-1',
        className
      )}
      {...props}
    >
      <img alt={alt} className='h-full w-full' src={imgUrl} />
      <span className='sr-only'>{alt}</span>
    </button>
  );
};
