import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const API_URL = 'https://api.lens.dev'

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache()
})

export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`;

export const authenticate = gql`
  mutation Authenticate(
    $address: EthereumAddress!
    $signature: Signature!
  ) {
    authenticate(request: {
      address: $address,
      signature: $signature
    }) {
      accessToken
      refreshToken
    }
  }
`;
// import { gql } from 'apollo-boost';

// Define the refreshAuthentication mutation
const REFRESH_AUTHENTICATION_MUTATION = gql`
  mutation RefreshAuthentication($refreshToken: String!) {
    refreshAuthentication(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;
export const refreshAuthentication = gql`
  mutation RefreshAuthentication($refreshToken: String!) {
    refreshAuthentication(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;






// Inside your code where you perform the token refresh
// export async function refreshAuthentication(refreshToken) {
//   try {
//     const response = await client.mutate({
//       mutation: REFRESH_AUTHENTICATION_MUTATION,
//       variables: { refreshToken },
//     });

//     const { accessToken, refreshToken: newRefreshToken } = response.data.refreshAuthentication;

//     // Do something with the new tokens (e.g., update state)
//   } catch (error) {
//     console.log('Error refreshing token: ', error);
//   }
// }

// // module.exports = {
// //     refreshAuthentication
// //   };