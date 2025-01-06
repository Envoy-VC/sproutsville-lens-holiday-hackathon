import { useApolloClient } from '@apollo/client';
import { evmAddress, txHash } from '@lens-protocol/client';
import {
  createAccountWithUsername,
  fetchAccount,
} from '@lens-protocol/client/actions';
import { type ChallengeRequest } from '@lens-protocol/graphql';
import { account } from '@lens-protocol/metadata';
import { useAccount, useSignMessage } from 'wagmi';

import { client } from '../client';
import { Constants } from '../constants';
import { ACCOUNTS_AVAILABLE_QUERY } from '../graphql';
import { uploadObject } from '../storage';

import type { AuthData } from '~/types/lens';

export const useLensAccount = () => {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const apolloClient = useApolloClient();

  const signMessage = async (message: string) => {
    return await signMessageAsync({ message });
  };

  const accountLogin = async (
    type?: keyof ChallengeRequest,
    accountToLogin?: string
  ) => {
    if (!address) {
      throw new Error('Please connect your wallet');
    }

    const authType = type ?? 'accountOwner';
    let params:
      | ChallengeRequest['accountOwner']
      | ChallengeRequest['accountManager']
      | ChallengeRequest['builder']
      | ChallengeRequest['onboardingUser'];
    if (authType === 'accountOwner') {
      if (!accountToLogin) {
        throw new Error('No account to login');
      }
      params = {
        owner: evmAddress(address),
        account: evmAddress(accountToLogin),
        app: evmAddress(Constants.SPROUTSVILLE_APP_ADDRESS),
      };
    } else if (authType === 'accountManager') {
      if (!accountToLogin) {
        throw new Error('No account to login');
      }
      params = {
        manager: evmAddress(address),
        account: evmAddress(accountToLogin),
        app: evmAddress(Constants.SPROUTSVILLE_APP_ADDRESS),
      };
    } else if (authType === 'builder') {
      params = {
        address: evmAddress(address),
      } as ChallengeRequest['builder'];
    } else {
      params = {
        wallet: evmAddress(address),
        app: evmAddress(Constants.SPROUTSVILLE_APP_ADDRESS),
      };
    }

    const res = await client.login({
      signMessage,
      [authType]: params,
    });

    if (res.isErr()) {
      throw res.error;
    }

    return res.value;
  };

  const registerUser = async (localName: string, name: string) => {
    if (!address) {
      throw new Error('Please connect your wallet');
    }
    const sessionClient = await getSessionClient('onboardingUser');
    const metadata = account({
      name,
    });

    const { uri } = await uploadObject(metadata);

    const res = await createAccountWithUsername(sessionClient, {
      accountManager: [evmAddress(address)],
      username: {
        namespace: evmAddress(Constants.SPROUTSVILLE_NAMESPACE_ADDRESS),
        localName,
      },
      metadataUri: uri,
    });

    if (res.isErr()) {
      throw res.error;
    }

    if (
      res.value.__typename === 'InvalidUsername' ||
      res.value.__typename === 'TransactionWillFail'
    ) {
      throw new Error(res.value.__typename);
    }

    const hash =
      res.value.__typename === 'CreateAccountResponse'
        ? (res.value.hash as string)
        : null;

    if (!hash) {
      throw new Error('No hash');
    }
    await sessionClient.waitForTransaction(txHash(hash));

    const accountRes = await fetchAccount(sessionClient, {
      txHash:
        '0x7751cfa57b23db4fa2faa9964494932be0270a11dff10715e275ab795f5eb428',
    });

    if (accountRes.isErr()) {
      throw accountRes.error;
    }

    await accountLogin('accountOwner', accountRes.value?.address as string);
  };

  const getSessionClient = async (type?: keyof ChallengeRequest) => {
    let sessionClient;

    // Check for Existing
    if (client.currentSession.isSessionClient()) {
      const existing = client.currentSession;
      console.log(existing);
      // Check if expired
      const { metadata } = JSON.parse(
        (await client.context.storage.getItem('lens.testnet.credentials')) ??
          `{}`
      ) as AuthData;
      const needsRefresh =
        new Date().getTime() - metadata.updatedAt > 10 * 60 * 1000;
      console.log('needsRefresh', needsRefresh);
      if (needsRefresh) {
        const res = await client.resumeSession();
        if (res.isErr()) {
          throw res.error;
        }
        sessionClient = res.value;
      } else {
        sessionClient = existing;
      }
    } else {
      console.log('No existing session');
      sessionClient = await accountLogin(type);
    }

    return sessionClient;
  };

  const getAllAccounts = async () => {
    if (!address) return [];
    const result = await apolloClient.query({
      query: ACCOUNTS_AVAILABLE_QUERY,
      variables: {
        managedBy: address,
      },
    });

    if (result.error) {
      throw result.error;
    }

    const res = result.data.accountsAvailable.items
      .map((acc) => {
        if (acc.__typename === 'AccountOwned') {
          const localName = acc.account.username?.localName ?? null;
          const namespace = acc.account.username?.namespace.namespace ?? null;
          const completeName =
            localName && namespace
              ? `${localName}/${namespace}`
              : (acc.account.metadata?.name ?? '');

          return {
            address: acc.account.address as string,
            localName,
            namespace,
            completeName,
          };
        }
        return null;
      })
      .filter((acc) => acc !== null);

    return res;
  };

  return {
    registerUser,
    accountLogin,
    getSessionClient,
    getAllAccounts,
  };
};
