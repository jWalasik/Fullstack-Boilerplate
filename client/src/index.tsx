import * as React from "react";
import { render } from "react-dom";

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-boost';
import { ApolloProvider, getApolloContext } from '@apollo/react-hooks';
import { AuthLink, errorLink, serverLink } from './apollo/links'
import { defaultState } from './apollo/store'

import App from "./router";
import { REFRESH_TOKEN } from "./apollo/mutations";
import { AuthProvider } from "./components/utils/AuthProvider";

const cache = new InMemoryCache()
cache.writeData({
	data: defaultState
})
const authLink = new AuthLink()

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, serverLink]),
	cache: cache,
	resolvers: {
		Query: {
			getUser: (_, __, {data})=>{
				console.log('user resolver')
			}
		}
	}, //graphql throws error on client queries if resolvers are undefined
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network'
		}
	}
});

authLink.injectClient(client)

client.onResetStore(():any => {
  cache.writeData({data : defaultState });
});

render(
	<ApolloProvider client={client}>
		<AuthProvider >
			<App /> 
		</AuthProvider>		         
	</ApolloProvider>,
	document.getElementById("root"),
);