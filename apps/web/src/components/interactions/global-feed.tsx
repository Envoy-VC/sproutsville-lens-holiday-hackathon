import { useTimeline } from '~/lib/lens';

export const GlobalFeed = () => {
  const { posts, error } = useTimeline();
  return (
    <div>
      Global Feed
      {JSON.stringify(posts, null, 2)}
      {JSON.stringify(error, null, 2)}
    </div>
  );
};
