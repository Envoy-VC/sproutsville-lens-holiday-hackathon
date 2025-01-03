import { gql } from '~/__generated__';

export const CREATE_NAMESPACE_MUTATION = gql(`mutation CreateUsernameNamespace(
  $metadataUri: URI!
  $namespace: String!
  $symbol: String!
  $admins: [EvmAddress!]
) {
  createUsernameNamespace(
    request: {
      metadataUri: $metadataUri
      namespace: $namespace
      symbol: $symbol
      admins: $admins
    }
  ) {
    ... on CreateNamespaceResponse {
      hash
    }

    ... on TransactionWillFail {
      reason
    }
  }
}
`);
