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

  request(operation: Operation, forward: NextLink): any {
    const {token} = operation.getContext()
    const {accessToken} = this.client.readQuery({query:GET_USER})
    //console.log('access',accessToken)
    if(accessToken) {
      console.log('access token detected set to header')      
      operation.setContext(({headers = {}} : any) => ({
        headers:{
          ...headers,
          authorization: token ? `Bearer ${accessToken}` : undefined
        }
      }))
    } 
      console.log('no access token try refreshing ')
      // return new Observable(observer => {
      //   let sub, innerSub
      //   try {
      //     sub = forward(operation).subscribe({
      //       next: observer.next.bind(observer),
      //       complete: observer.complete.bind(observer),
      //       error: networkError => {
      //        console.log('network error')
      //       }
      //     })
      //   } catch (err) {
      //     console.log('catched error',err)
         
      //     observer.error(err)
      //   }
      //   console.log(sub)
      //   return ()=>{
      //     if(sub) sub.unsuscribe()
      //     if(innerSub) innerSub.unsuscribe()
      //   }
      // })
    
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