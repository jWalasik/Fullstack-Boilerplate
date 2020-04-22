import * as React from "react";
import { render } from "react-dom";

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, gql } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';

import {AuthLink, errorLink, serverLink} from './apollo/links'
import { GET_REF_TOKEN} from './apollo/queries'

import App from "./router";

const cache = new InMemoryCache()
const authLink = new AuthLink()

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, serverLink]),
  cache: cache
});

console.log('try silent refresh')
new Promise(()=>{
	client.readQuery({
		query: gql`
			query silentRefresh {
				
			}
		`
	})
}).then(result => {
	console.log('res:', result)
}).catch(err=>console.log(err))


render(
	<ApolloProvider client={client}>
		<App />          
	</ApolloProvider>,
	document.getElementById("root"),
);