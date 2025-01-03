import { type SessionClient } from '@lens-protocol/client';
import { currentSession } from '@lens-protocol/client/actions';
import { type ChallengeRequest } from '@lens-protocol/graphql';
import { useQuery } from '@tanstack/react-query';
import { useSignMessage } from 'wagmi';

import { client } from '../client';

export const useLensAccount = () => {
  const { signMessageAsync } = useSignMessage();
  const { data } = useQuery({
    queryKey: ['currentSession'],
    queryFn: async () => {
      if (client.currentSession.isPublicClient()) return null;
      const res = await currentSession(client.currentSession);
      if (res.isErr()) return null;
      return res.value;
    },
  });

  async function login(
    type: 'builder',
    params: ChallengeRequest['builder']
  ): Promise<SessionClient>;
  async function login(
    type: 'onboardingUser',
    params: ChallengeRequest['onboardingUser']
  ): Promise<SessionClient>;
  async function login(
    type: 'accountOwner',
    params: ChallengeRequest['accountOwner']
  ): Promise<SessionClient>;
  async function login(
    type: 'accountManager',
    params: ChallengeRequest['accountManager']
  ): Promise<SessionClient>;

  async function login(type: string, params: unknown): Promise<SessionClient> {
    const signMessage = async (message: string) => {
      return await signMessageAsync({ message });
    };
    let authenticated;
    if (type === 'builder') {
      const p = params as ChallengeRequest['builder'];
      authenticated = await client.login({ signMessage, [type]: p });
    } else if (type === 'onboardingUser') {
      const p = params as ChallengeRequest['onboardingUser'];
      authenticated = await client.login({ signMessage, [type]: p });
    } else if (type === 'accountOwner') {
      const p = params as ChallengeRequest['accountOwner'];
      authenticated = await client.login({ signMessage, [type]: p });
    } else if (type === 'accountManager') {
      const p = params as ChallengeRequest['accountManager'];
      authenticated = await client.login({ signMessage, [type]: p });
    } else {
      throw new Error(`Invalid type: ${type}`);
    }

    if (authenticated.isErr()) {
      throw authenticated.error;
    }

    return authenticated.value;
  }

  return { login, currentSession: data ?? null };
};
