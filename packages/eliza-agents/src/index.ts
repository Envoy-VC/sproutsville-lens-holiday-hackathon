import { PostgresDatabaseAdapter } from '@ai16z/adapter-postgres';
import { type DirectClient, DirectClientInterface } from '@ai16z/client-direct';
import {
  AgentRuntime,
  CacheManager,
  type Character,
  DbCacheAdapter,
  type ICacheManager,
  type IDatabaseAdapter,
  type IDatabaseCacheAdapter,
  stringToUuid,
} from '@ai16z/eliza';
import { bootstrapPlugin } from '@ai16z/plugin-bootstrap';
import { nodePlugin } from '@ai16z/plugin-node';

import { characters } from './characters';

export const initializeDB = () => {
  const db = new PostgresDatabaseAdapter({
    connectionString: process.env.POSTGRES_URL,
  });
  return db;
};

const initializeDbCache = (character: Character, db: IDatabaseCacheAdapter) => {
  const cache = new CacheManager(
    new DbCacheAdapter(db, character.id ?? stringToUuid(character.name))
  );
  return cache;
};

export function createAgent(
  character: Character,
  db: IDatabaseAdapter,
  cache: ICacheManager
) {
  return new AgentRuntime({
    databaseAdapter: db,
    token: '',
    modelProvider: character.modelProvider,
    evaluators: [],
    character,
    plugins: [bootstrapPlugin, nodePlugin],
    providers: [],
    actions: [],
    services: [],
    managers: [],
    cacheManager: cache,
  });
}

export const startAgent = async (
  character: Character,
  directClient: DirectClient
) => {
  character.id ??= stringToUuid(character.name);
  character.username ??= character.name;
  const db = initializeDB();
  await db.init();

  const cache = initializeDbCache(character, db);
  const runtime = createAgent(character, db, cache);

  await runtime.initialize();

  directClient.registerAgent(runtime);
};

const startAgents = async () => {
  const directClient = (await DirectClientInterface.start()) as DirectClient;
  for (const character of characters) {
    await startAgent(character, directClient);
  }
};

startAgents().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
