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

export const CREATE_USERNAME_MUTATION = gql(`mutation CreateAccountWithUsername(
  $localName: String!
  $metadataUri: URI!
  $owner: EvmAddress!
  $namespace: EvmAddress!
) {
  createAccountWithUsername(
    request: {
      username: {
        localName: $localName
        namespace: $namespace
      }
      metadataUri: $metadataUri
      accountManager: [$owner]
    }
  ) {
    ... on CreateAccountResponse {
      hash
    }

    ... on InvalidUsername {
      reason
    }

    ... on TransactionWillFail {
      reason
    }
  }
}`);
