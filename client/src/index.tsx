import * as React from "react";
import { render } from "react-dom";

import Cookies from 'js-cookie'
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, gql } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import {graphql, Query} from 'react-apollo'
import {AuthLink, errorLink, serverLink} from './apollo/links'

import {REFRESH_TOKEN} from './apollo/queries'

import App from "./router";

const cache = new InMemoryCache()
const authLink = new AuthLink()

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, serverLink]),
	cache: cache,
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network'
		}
	}
});

authLink.injectClient(client)

const defaultData = {
	isAuth: false,
	name: null,
	email: null,
	accessToken: null
}
client.onResetStore(():any => {
  cache.writeData({data : defaultData });
});
//initialize default state
cache.writeData({
	data: {
		isAuth: false,
		name: null,
		email: null,
		accessToken: null,
		refreshToken: null
	}
})

render(
	<ApolloProvider client={client}>
		<App />          
	</ApolloProvider>,
	document.getElementById("root"),
);