import { useMutation } from '@apollo/client';
import { evmAddress } from '@lens-protocol/client';
// import { username } from '@lens-protocol/metadata';
import { useAccount } from 'wagmi';

import { CREATE_NAMESPACE_MUTATION } from '../graphql';
import { useLensAccount } from './use-account';

export const useLensNamespace = () => {
  const { address } = useAccount();
  const [create] = useMutation(CREATE_NAMESPACE_MUTATION);

  const { login, currentSession } = useLensAccount();

  const createNamespace = async () => {
    if (!address) return;

    if (!currentSession) {
      await login('builder', { address: evmAddress(address) });
    }

    // const metadata = username({
    //   description: 'Username Namespace for SproutsVille',
    //   collection: {
    //     name: 'SproutsVille Usernames',
    //     description: 'The official sproutsville/ usernames',
    //   },
    // });

    const variables = {
      metadataUri:
        'lens://f9c098aec0192c1ece12c0d8b1626923111a0e7e9156ae718e2d3a8233350a31',
      namespace: 'sproutsville',
      symbol: 'SPROUTS',
      admins: [address],
    };

    const response = await create({ variables });
    console.log(response);
  };
  return { createNamespace };
};
