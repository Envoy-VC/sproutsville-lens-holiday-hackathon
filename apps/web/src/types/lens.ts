import type { AuthenticationTokens } from '../__generated__/graphql';

export interface AuthData {
  data: AuthenticationTokens;
  metadata: {
    createdAt: number;
    updatedAt: number;
  };
}
