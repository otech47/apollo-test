import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import resolvers from './state/resolvers';

const API_URL = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap'

const cache = new InMemoryCache()
const client = new ApolloClient({
    uri: API_URL,
    cache,
    resolvers
});

cache.writeData({
    data: {
        transactions: [],
        users: []
    }
})

ReactDOM.render((
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
