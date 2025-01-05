import { gql } from '~/__generated__';

export const CREATE_APP_MUTATION = gql(`mutation CreateAppMutation(
$metadataUri: URI!
$namespace: EvmAddress!
$admins: [EvmAddress!]
) {
  createApp(request: {
    metadataUri: $metadataUri
    namespace: $namespace
    admins: $admins
  }) {
    ... on CreateAppResponse {
      hash
    }
  }
}`);

export const SET_APP_NAMESPACE = gql(`mutation SetAppNamespace(
$usernameNamespace: EvmAddress!
$app: EvmAddress!
) {
  setAppUsernameNamespace(request: {
    usernameNamespace: $usernameNamespace
    app: $app
  }) {
... on SponsoredTransactionRequest {
      reason
      sponsoredReason
      raw {
        nonce
        to
        from
        data
        type
        value
        gasLimit
        maxFeePerGas
        maxPriorityFeePerGas
        customData {
          customSignature
          factoryDeps
          gasPerPubdata
          paymasterParams {
            paymaster
            paymasterInput
          }
        }
        chainId
      }
    }
    ... on TransactionWillFail {
      reason
    }
    ... on SelfFundedTransactionRequest {
      raw {
        type
        to
        from
        nonce
        gasLimit
        maxPriorityFeePerGas
        maxFeePerGas
        data
        value
        chainId
      }
      reason
      selfFundedReason
    }
  }
}`);

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

export const TIMELINE_QUERY =
  gql(`query Query($account: EvmAddress!, $filter: TimelineFilter, $forFeeds: [EvmAddress!]) {
  timeline(request: {
    account: $account
    filter: $filter
    forFeeds: $forFeeds
  }) {
    items {
      id
      primary {
        author {
          address
          createdAt
          metadata {
            name
            picture
            id
            coverPicture
            bio
          }
        }
        metadata {
          ... on TextOnlyMetadata {
            content
            id
            mainContentFocus
            locale
          }
        }
        id
      }
    }
    pageInfo {
      next
      prev
    }
  }
}`);
