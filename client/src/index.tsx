import * as React from "react";
import { render } from "react-dom";
import ApolloClient, {InMemoryCache} from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import App from "./router";

const cache = new InMemoryCache()
const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	headers: {
		authorization: localStorage.getItem('token'),
		'client-name': 'diet-helper'
	},
	onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  },
	cache
})

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