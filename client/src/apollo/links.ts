import {ApolloLink, Observable, Operation, NextLink, HttpLink} from 'apollo-boost'
import { onError } from 'apollo-link-error';

export class AuthLink extends ApolloLink {
  request(operation: Operation, forward: NextLink): any {
    console.log('xxx')
    const {token} = operation.getContext()
    console.log('auth middleware:', token)
    if(token) {
      console.log(token)
      
      operation.setContext({
        headers:{
          authorization: token ? `Bearer ${token}` : ''
        }
      })
    }
    return forward(operation)
  }
}

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) graphQLErrors.forEach(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
  if (networkError) console.log(`[Network error]: ${networkError}`);
})

export const serverLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
})