import { type InteractionType } from '~/game/state';

import { DailyRewards } from './daily-rewards';
import { FarmInteraction } from './farm';
import { GlobalFeed } from './global-feed';
import { Onboarding } from './onboarding';
import { CreatePost } from './post';

export const InteractionContent = ({
  interactionType,
}: {
  interactionType: InteractionType;
}) => {
  if (interactionType === 'onboarding') {
    return <Onboarding />;
  } else if (interactionType === 'global-feed') {
    return <GlobalFeed />;
  } else if (interactionType === 'peasant-house') {
    return <CreatePost />;
  } else if (interactionType === 'bank') {
    return <DailyRewards />;
  } else if (interactionType === 'farm-land') {
    return <FarmInteraction />;
  }
  return null;
};
