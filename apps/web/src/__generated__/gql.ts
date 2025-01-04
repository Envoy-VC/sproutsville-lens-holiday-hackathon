/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
  'mutation CreateUsernameNamespace(\n  $metadataUri: URI!\n  $namespace: String!\n  $symbol: String!\n  $admins: [EvmAddress!]\n) {\n  createUsernameNamespace(\n    request: {\n      metadataUri: $metadataUri\n      namespace: $namespace\n      symbol: $symbol\n      admins: $admins\n    }\n  ) {\n    ... on CreateNamespaceResponse {\n      hash\n    }\n\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}\n':
    types.CreateUsernameNamespaceDocument,
  'mutation CreateAccountWithUsername(\n  $localName: String!\n  $metadataUri: URI!\n  $owner: EvmAddress!\n  $namespace: EvmAddress!\n) {\n  createAccountWithUsername(\n    request: {\n      username: {\n        localName: $localName\n        namespace: $namespace\n      }\n      metadataUri: $metadataUri\n      accountManager: [$owner]\n    }\n  ) {\n    ... on CreateAccountResponse {\n      hash\n    }\n\n    ... on InvalidUsername {\n      reason\n    }\n\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}':
    types.CreateAccountWithUsernameDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: 'mutation CreateUsernameNamespace(\n  $metadataUri: URI!\n  $namespace: String!\n  $symbol: String!\n  $admins: [EvmAddress!]\n) {\n  createUsernameNamespace(\n    request: {\n      metadataUri: $metadataUri\n      namespace: $namespace\n      symbol: $symbol\n      admins: $admins\n    }\n  ) {\n    ... on CreateNamespaceResponse {\n      hash\n    }\n\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}\n'
): (typeof documents)['mutation CreateUsernameNamespace(\n  $metadataUri: URI!\n  $namespace: String!\n  $symbol: String!\n  $admins: [EvmAddress!]\n) {\n  createUsernameNamespace(\n    request: {\n      metadataUri: $metadataUri\n      namespace: $namespace\n      symbol: $symbol\n      admins: $admins\n    }\n  ) {\n    ... on CreateNamespaceResponse {\n      hash\n    }\n\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: 'mutation CreateAccountWithUsername(\n  $localName: String!\n  $metadataUri: URI!\n  $owner: EvmAddress!\n  $namespace: EvmAddress!\n) {\n  createAccountWithUsername(\n    request: {\n      username: {\n        localName: $localName\n        namespace: $namespace\n      }\n      metadataUri: $metadataUri\n      accountManager: [$owner]\n    }\n  ) {\n    ... on CreateAccountResponse {\n      hash\n    }\n\n    ... on InvalidUsername {\n      reason\n    }\n\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}'
): (typeof documents)['mutation CreateAccountWithUsername(\n  $localName: String!\n  $metadataUri: URI!\n  $owner: EvmAddress!\n  $namespace: EvmAddress!\n) {\n  createAccountWithUsername(\n    request: {\n      username: {\n        localName: $localName\n        namespace: $namespace\n      }\n      metadataUri: $metadataUri\n      accountManager: [$owner]\n    }\n  ) {\n    ... on CreateAccountResponse {\n      hash\n    }\n\n    ... on InvalidUsername {\n      reason\n    }\n\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
