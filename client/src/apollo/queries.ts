import { gql } from 'apollo-boost';

export const checkAuth = gql`
  query IsUserLoggedIn {
    isAuth @client
  }
`
