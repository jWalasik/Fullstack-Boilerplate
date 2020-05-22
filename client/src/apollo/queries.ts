import { gql } from 'apollo-boost';

export const IS_AUTH = gql`
  query IsAuthenticated {
    isAuthenticated
  }
`
export const GET_USER = gql`
  query getUser {
    user @client {
      name
      email
      accessToken
      sessionExpiresIn
    }
  }
`