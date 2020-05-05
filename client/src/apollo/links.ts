import {ApolloLink, Observable, Operation, NextLink, HttpLink} from 'apollo-boost'
import { onError } from 'apollo-link-error';

import {GET_USER} from '../apollo/queries'
import {REFRESH_TOKEN} from '../apollo/mutations'

export class AuthLink extends ApolloLink {
  client
  refreshed = false //prevents refreshing loop

  injectClient(client) {
    this.client = client
  }

   request(operation: Operation, forward: NextLink): any{
    console.log(this.client)
    let {accessToken} = this.client.readQuery({query:GET_USER})
    //const accessToken = 0
    if(accessToken) {
      console.log('access token detected set to header', accessToken)      
      operation.setContext(({headers = {}} : any) => ({
        headers:{
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : undefined
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