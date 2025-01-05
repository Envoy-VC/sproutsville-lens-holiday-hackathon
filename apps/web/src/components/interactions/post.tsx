import { useState } from 'react';

import { usePost } from '~/lib/lens';

import { toast } from 'sonner';

import { GameButton } from '../game-button';

export const CreatePost = () => {
  const { createPost } = usePost();

  const [content, setContent] = useState<string>('');
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='text-center font-minecraftia text-2xl font-black'>
        What&lsquo;s on your mind?
      </div>
      <textarea
        className='border-brown-500 relative flex w-full max-w-xl cursor-pointer rounded-md border-2 border-[#6B5052] px-3 pt-4 font-minecraftia text-xl text-[#6B5052] focus:outline-none'
        placeholder='Share your thoughts with the world...'
        rows={8}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className='flex w-full justify-center'>
        <GameButton
          className='h-16 w-72'
          innerClassName='text-base font-minecraftia pt-3'
          onClick={async () => {
            try {
              await createPost(content);
              toast.success('Post created successfully');
            } catch (error) {
              console.error(error);
              toast.error('Failed to create post');
            }
          }}
        >
          Post
        </GameButton>
      </div>
    </div>
  );
};
