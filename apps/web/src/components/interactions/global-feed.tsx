import { useTimeline } from '~/lib/lens';

export const GlobalFeed = () => {
  const { posts } = useTimeline();
  return (
    <div className='flex flex-col gap-6 pt-4'>
      <div className='text-center font-minecraftia text-3xl font-black'>
        Sproutsville Feed
      </div>
      <div className='mx-auto flex w-full flex-col gap-2'>
        {posts?.map((post) => (
          <div
            key={post.id}
            className='mx-4 flex flex-col gap-1 rounded-xl bg-[#6B5052] px-4 pt-4 pb-2 text-[#C3AC90]'
          >
            <div className='font-minecraftia text-base font-black'>
              {post.author.completeName}
            </div>
            <div className='font-minecraftia text-base'>{post.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
