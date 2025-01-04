import { type InteractionType } from '~/game/state';

import { Onboarding } from './onboarding';

export const InteractionContent = ({
  interactionType,
}: {
  interactionType: InteractionType;
}) => {
  if (interactionType === 'onboarding') {
    return <Onboarding />;
  }
  return null;
};
