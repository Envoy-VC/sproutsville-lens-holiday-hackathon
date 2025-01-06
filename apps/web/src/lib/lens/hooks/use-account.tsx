import { useApolloClient } from '@apollo/client';
import {
  type ChallengeRequest,
  type SelfFundedTransactionRequest,
  type SponsoredTransactionRequest,
  type TransactionWillFail,
  evmAddress,
  txHash,
} from '@lens-protocol/client';
import {
  createAccountWithUsername,
  enableSignless,
  fetchAccount,
} from '@lens-protocol/client/actions';
import { account } from '@lens-protocol/metadata';
import { getWalletClient, waitForTransactionReceipt } from '@wagmi/core';
import { useAccount, useSignMessage } from 'wagmi';
import { config } from '~/providers/web3-provider';

import { client } from '../client';
import { Constants } from '../constants';
import { ACCOUNTS_AVAILABLE_QUERY } from '../graphql';
import { uploadObject } from '../storage';

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
        // TODO: Custom namespace are not working
        // namespace: evmAddress(Constants.SPROUTSVILLE_NAMESPACE_ADDRESS),
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
      txHash: hash,
    });

    if (accountRes.isErr()) {
      throw accountRes.error;
    }

    await accountLogin('accountOwner', accountRes.value?.address as string);

    const enableSignlessRes = await enableSignless(sessionClient);
    if (enableSignlessRes.isErr()) {
      throw enableSignlessRes.error;
    }

    const details = await sendTx(enableSignlessRes.value);
    return details;
  };

  const getSessionClient = async (type?: keyof ChallengeRequest) => {
    let sessionClient;
    const c = await client.resumeSession();
    if (c.isErr()) {
      sessionClient = await accountLogin(type);
    } else {
      sessionClient = c.value;
    }

    return sessionClient;
  };

  const getAllAccounts = async () => {
    console.log('Run');
    if (!address) {
      console.error('No address');
      return [];
    }
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
        if (acc.__typename === 'AccountOwned' && acc.account.username) {
          const localName = acc.account.username.localName;
          const namespace = acc.account.username.namespace.namespace;
          const completeName =
            localName && namespace
              ? `${namespace}/${localName}`
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

  const sendTx = async (
    tx:
      | SponsoredTransactionRequest
      | SelfFundedTransactionRequest
      | TransactionWillFail
  ) => {
    const walletClient = await getWalletClient(config);
    if (tx.__typename === 'TransactionWillFail') {
      throw new Error('Transaction will fail');
    }

    // @ts-expect-error -- safe to ignore
    const hash = await walletClient.sendTransaction(tx.raw);
    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
  };

  return {
    registerUser,
    accountLogin,
    getSessionClient,
    getAllAccounts,
    sendTx,
  };
};
