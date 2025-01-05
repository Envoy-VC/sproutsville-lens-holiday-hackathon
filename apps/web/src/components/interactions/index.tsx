import { type InteractionType } from '~/game/state';

import { GlobalFeed } from './global-feed';
import { Onboarding } from './onboarding';

export const InteractionContent = ({
  interactionType,
}: {
  interactionType: InteractionType;
}) => {
  if (interactionType === 'onboarding') {
    return <Onboarding />;
  } else if (interactionType === 'global-feed') {
    return <GlobalFeed />;
  }
  return null;
};
