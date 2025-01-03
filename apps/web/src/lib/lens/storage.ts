import { StorageClient, testnet } from '@lens-protocol/storage-node-client';

const storageClient = StorageClient.create(testnet);

export const uploadObject = async (obj: object) => {
  const response = await storageClient.uploadAsJson(obj);
  return response;
};
