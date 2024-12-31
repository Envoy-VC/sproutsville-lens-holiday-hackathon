import { createFileRoute } from '@tanstack/react-router';
import { HomeMenu } from '~/components';

export const HomeComponent = () => {
  return (
    <div className='!m-0 !p-0'>
      <img
        alt='background'
        className='absolute h-screen w-full'
        src='/background.png'
      />
      <div className='absolute top-[8%] right-1/2 z-[1] translate-x-1/2'>
        <img alt='logo' className='max-w-xl' src='/logo-text.png' />
      </div>
      <div className='absolute right-1/2 bottom-[20%] z-[1] flex w-full translate-x-1/2 justify-center'>
        <HomeMenu />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
