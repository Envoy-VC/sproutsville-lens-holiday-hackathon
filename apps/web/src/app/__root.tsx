import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ProviderTree } from '~/providers';

import { Toaster } from '~/components/ui/sonner';

const RootComponent = () => {
  return (
    <ProviderTree>
      <Outlet />
      {import.meta.env.MODE === 'q' && (
        <TanStackRouterDevtools position='bottom-right' />
      )}
      <Toaster />
    </ProviderTree>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
