import * as React from "react";
import { render } from "react-dom";

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { onError } from 'apollo-link-error';

import {GET_REF_TOKEN, GET_USER} from './apollo/queries'

import App from "./router";

const cache = new InMemoryCache()

let jwt

const authMiddleware = new ApolloLink((operation, forward)=>{
  console.log(cache.data.data.ROOT_QUERY)
  if(jwt) {
    console.log('auth middleware:', jwt)
    operation.setContext({
      headers:{
        authorization: jwt ? `Bearer ${jwt}` : ''
      }
    })
  }
  return forward(operation)
})
const links = ApolloLink.from([
  authMiddleware,
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) graphQLErrors.forEach(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }),
  createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
  })
])

const client = new ApolloClient({
  resolvers: {},
  link: links,
  cache: cache
});

cache.writeData({
	data: {
    isAuth: !!localStorage.getItem('token')
	}
})

render(
	<ApolloProvider client={client}>
		<App />          
	</ApolloProvider>,
	document.getElementById("root"),
);