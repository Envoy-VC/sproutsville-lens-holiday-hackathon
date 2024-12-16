import { createFileRoute } from '@tanstack/react-router';
import { ConnectKitButton } from 'connectkit';

const HomeComponent = () => {
  return (
    <div className='p-2'>
      <h3>Welcome Home!</h3>
      <ConnectKitButton />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
