import { post } from '@lens-protocol/client/actions';
import { textOnly } from '@lens-protocol/metadata';

import { uploadObject } from '../storage';
import { useLensAccount } from './use-account';

export const usePost = () => {
  const { getSessionClient } = useLensAccount();

  const createPost = async (content: string) => {
    const metadata = textOnly({
      content,
    });

    const sessionClient = await getSessionClient();

    const { uri } = await uploadObject(metadata);
    await post(sessionClient, { contentUri: uri });
  };

  return { createPost };
};
