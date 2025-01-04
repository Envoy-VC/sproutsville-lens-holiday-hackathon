import { useMutation } from '@apollo/client';
import { type SessionClient, evmAddress } from '@lens-protocol/client';
import { currentSession } from '@lens-protocol/client/actions';
import { type ChallengeRequest } from '@lens-protocol/graphql';
import { account } from '@lens-protocol/metadata';
import { useQuery } from '@tanstack/react-query';
import { useAccount, useSignMessage } from 'wagmi';

import { client } from '../client';
import { Constants } from '../constants';
import { CREATE_USERNAME_MUTATION } from '../graphql';
import { uploadObject } from '../storage';

export const useLensAccount = () => {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const [register] = useMutation(CREATE_USERNAME_MUTATION);
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
    // if (client.currentSession.isSessionClient().valueOf()) {
    //   const session = await client.resumeSession();
    //   if (session.isErr()) {
    //     throw session.error;
    //   }
    //   const result = await currentSession(session.value);
    //   if (result.isErr()) {
    //     throw result.error;
    //   }
    //   result.value.authenticationId;
    // } else {
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
    // }

    if (authenticated.isErr()) {
      throw authenticated.error;
    }

    return authenticated.value;
  }

  const registerUser = async (localName: string, name: string) => {
    if (!address) {
      throw new Error('Please connect your wallet');
    }
    await login('onboardingUser', {
      wallet: evmAddress(address),
      app: evmAddress(Constants.SPROUTSVILLE_APP_ADDRESS),
    });
    const metadata = account({
      name,
    });

    const { uri } = await uploadObject(metadata);
    const res = await register({
      variables: {
        localName,
        metadataUri: uri,
        owner: address,
        namespace: evmAddress(Constants.SPROUTSVILLE_NAMESPACE_ADDRESS),
      },
    });

    if (res.errors?.[0]) {
      throw new Error(res.errors[0].message);
    }

    if (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
      res.data?.createAccountWithUsername.__typename === 'CreateAccountResponse'
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
      return res.data.createAccountWithUsername.hash as string;
    }
    throw new Error('Failed to create account');
  };

  return { login, currentSession: data ?? null, registerUser };
};
