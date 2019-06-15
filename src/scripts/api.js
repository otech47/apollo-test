// 
// export const fetchData = () => {
//     return fetch(API_URL, {
//         method: 'GET',
//         crossDomain: true,
//         xhrFields: {
//             withCredentials: true
//         },
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             'Access-Control-Allow-Headers': ['Access-Control-Allow-Headers', 'Origin', 'Access-Control-Allow-Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Cache-Control']
//         },
//     })
//     .then(response => response.json())
// }

import ApolloClient, { gql } from 'apollo-boost';

const API_URL = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap'

const client = new ApolloClient({
    uri: API_URL
});

export const fetchData = () => {
    // return new Promise()
    return client
    .query({
        query: gql`
        {
            exchanges(first: 5) {
                id
            }
        }
    `
    })
    .then(result => console.log(result));
}