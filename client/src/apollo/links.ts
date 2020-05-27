import {ApolloLink, Observable, Operation, NextLink, HttpLink, FetchResult} from 'apollo-boost'
import { onError } from 'apollo-link-error';

import {GET_USER} from '../apollo/queries'
import {REFRESH_TOKEN} from '../apollo/mutations'

export class AuthLink extends ApolloLink {
  client
  refreshing = false
  sessionExpIn = null

  injectClient(client) {
    this.client = client
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    const {user} = this.client.readQuery({query: GET_USER})

    if(user.accessToken) {      
      operation.setContext(({headers = {}} : any) => ({
        headers:{
          ...headers,
          authorization: user.accessToken ? `Bearer ${user.accessToken}` : undefined
        }
      }))
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