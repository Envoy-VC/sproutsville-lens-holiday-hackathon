import { post } from '@lens-protocol/client/actions';
import { textOnly } from '@lens-protocol/metadata';

import { client } from '../client';
import { uploadObject } from '../storage';
import { useLensAccount } from './use-account';

export const usePost = () => {
  const { accountLogin } = useLensAccount();

  const createPost = async (content: string) => {
    const metadata = textOnly({
      content,
    });

    let sessionClient;

    const res = await client.resumeSession();
    if (res.isOk()) {
      sessionClient = res.value;
    } else {
      sessionClient = await accountLogin();
    }

    const { uri } = await uploadObject(metadata);
    await post(sessionClient, { contentUri: uri });
  };

  return { createPost };
};
