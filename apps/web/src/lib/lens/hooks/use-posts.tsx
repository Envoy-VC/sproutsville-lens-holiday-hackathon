import { post } from '@lens-protocol/client/actions';
import { textOnly } from '@lens-protocol/metadata';

import { uploadObject } from '../storage';
import { useLensAccount } from './use-account';

export const usePost = () => {
  const { getCurrentSession } = useLensAccount();

  const createPost = async (content: string) => {
    const metadata = textOnly({
      content,
    });

    const currentSession = getCurrentSession();

    const { uri } = await uploadObject(metadata);
    await post(currentSession, { contentUri: uri });
  };

  return { createPost };
};
