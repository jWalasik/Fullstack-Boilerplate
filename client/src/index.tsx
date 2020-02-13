import * as React from "react";
import { render } from "react-dom";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom'

import App from "./components/App";

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
})

render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <App/> 
        </BrowserRouter>           
    </ApolloProvider>,
    document.getElementById("root"),
);