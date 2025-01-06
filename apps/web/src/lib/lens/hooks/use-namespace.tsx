import { useMutation } from '@apollo/client';
import { evmAddress } from '@lens-protocol/client';
// import { username } from '@lens-protocol/metadata';
import { useAccount, useWalletClient } from 'wagmi';

import { Constants } from '../constants';
import {
  CREATE_APP_MUTATION,
  CREATE_NAMESPACE_MUTATION,
  SET_APP_NAMESPACE,
} from '../graphql';
import { useLensAccount } from './use-account';

export const useLensNamespace = () => {
  const { address } = useAccount();
  const [create] = useMutation(CREATE_NAMESPACE_MUTATION);
  const [createAppMutation] = useMutation(CREATE_APP_MUTATION);
  const [setAppNamespaceMutation] = useMutation(SET_APP_NAMESPACE);

  const { accountLogin } = useLensAccount();

  const { data: walletClient } = useWalletClient();

  const setNamespace = async () => {
    if (!address) return;
    if (!walletClient?.account) return;
    await accountLogin('builder');
    const res = await setAppNamespaceMutation({
      variables: {
        usernameNamespace: evmAddress(Constants.SPROUTSVILLE_NAMESPACE_ADDRESS),
        app: evmAddress(Constants.SPROUTSVILLE_APP_ADDRESS),
      },
    });

    console.log(res);
  };

  const createLensApp = async () => {
    if (!address) return;
    if (!walletClient?.account) return;
    await accountLogin('builder');
    const result = await createAppMutation({
      variables: {
        metadataUri: Constants.SPROUTSVILLE_METADATA_URI,
        namespace: evmAddress(Constants.SPROUTSVILLE_NAMESPACE_ADDRESS),
        admins: [address],
      },
    });

    console.log(result);
  };

  const createNamespace = async () => {
    if (!address) return;
    await accountLogin('builder');

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
  return { createNamespace, createLensApp, setNamespace };
};
