import { evmAddress } from '@lens-protocol/client';
import { post } from '@lens-protocol/client/actions';
import { textOnly } from '@lens-protocol/metadata';
import { useWalletClient } from 'wagmi';

import { Constants } from '../constants';
import { uploadObject } from '../storage';
import { useLensAccount } from './use-account';

export const usePost = () => {
  const { getSessionClient, sendTx } = useLensAccount();
  const { data: walletClient } = useWalletClient();

  const createPost = async (content: string) => {
    if (!walletClient) {
      throw new Error('Please connect your wallet');
    }
    const metadata = textOnly({
      content,
    });

    const sessionClient = await getSessionClient();

    const { uri } = await uploadObject(metadata);
    const res = await post(sessionClient, {
      contentUri: uri,
      feed: evmAddress(Constants.SPROUTSVILLE_FEED_ADDRESS),
    });

    if (res.isErr()) {
      throw res.error;
    }

    if (res.value.__typename === 'PostResponse') {
      return res.value.hash as string;
    } else if (res.value.__typename === 'TransactionWillFail') {
      throw new Error('Transaction will fail');
    } else {
      return await sendTx(res.value);
    }
  };

  return { createPost };
};
