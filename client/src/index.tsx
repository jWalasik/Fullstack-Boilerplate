import * as React from "react";
import { render } from "react-dom";

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { AuthLink, errorLink, serverLink } from './apollo/links'
import { defaultState } from './apollo/store'

import App from "./router";
import { REFRESH_TOKEN } from "./apollo/mutations";

const cache = new InMemoryCache()
const authLink = new AuthLink()

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, serverLink]),
	cache: cache,
	resolvers: {}, //graphql throws error on client queries if resolvers are undefined
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
//initialize default state
cache.writeData({
	data: defaultState
})

// client.mutate({mutation: REFRESH_TOKEN}).then((res) => {
// 	console.log('refresh')
// 	if(res) {
// 		const {name, email, accessToken} = res.data.refreshToken
// 		client.writeData({
// 			data: {
// 				user: {
// 					name: name,
// 					email: email,
// 					accessToken: accessToken,
// 					__typename: 'User'
// 				}
// 			}
// 		})
// 		//setAutorefresh(this)
// 	}
// })

render(
	<ApolloProvider client={client}>
		<App />          
	</ApolloProvider>,
	document.getElementById("root"),
);