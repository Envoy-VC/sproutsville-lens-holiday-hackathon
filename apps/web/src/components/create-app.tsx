import { appMetadata, uploadObject, useLensAccount } from '~/lib/lens';

import { evmAddress } from '@lens-protocol/client';
import { createApp, fetchApp } from '@lens-protocol/client/actions';
import { handleWith } from '@lens-protocol/client/viem';
import { useAccount, useWalletClient } from 'wagmi';

import { GameButton } from './game-button';

export const CreateAppButton = () => {
  const { address } = useAccount();
  const walletClient = useWalletClient();
  const { login } = useLensAccount();

  return (
    <div className='absolute top-4 right-4'>
      <GameButton
        className='h-16 w-48'
        innerClassName='text-base font-minecraftia pt-3'
        onClick={async () => {
          if (!address || !walletClient.data?.account) {
            throw new Error('No address found');
          }
          console.log('Creating app with address', evmAddress(address));
          const session = await login('builder', {
            address: evmAddress(address),
          });

          const res = await uploadObject(appMetadata);
          console.log(res);

          const result = await createApp(session, {
            verification: true,
            metadataUri: res.uri,
          })
            .andThen(handleWith(walletClient.data))
            .andThen(session.waitForTransaction)
            .andThen((txHash) => fetchApp(session, { txHash }));

          if (result.isErr()) {
            console.error(result.error.message);
            return;
          }

          const app = result.value;
          console.log('App created', app);
        }}
      >
        Create App
      </GameButton>
    </div>
  );
};
