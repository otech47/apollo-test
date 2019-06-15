import moment from 'moment'
import _ from 'lodash'
import { gql } from 'apollo-boost';

const resolvers = {
    Mutation: {
        addTxn: (_root, variables, { cache, getCacheKey }) => {
            const { fromId, toId, amount, page } = variables

            const updateTxnSetFromUser = () => {
                const fromUserQuery = gql`
                    query GetUserTxs {
                        transactions(
                            where: {
                                user: "${fromId}"
                            },
                            first: 10,
                            orderBy: timestamp,
                            orderDirection: desc
                        ) {
                            id,
                            event,
                            exchangeAddress,
                            ethAmount,
                            timestamp,
                            tokenSymbol,
                            user
                        }
                    }
                    
                `;
                const fromUserResult = cache.readQuery({ query: fromUserQuery });
                const currentTimestamp = moment.utc().format('X')
                const newTxnFromUser = {
                    id: currentTimestamp.toString() + fromId,
                    ethAmount: amount,
                    event: 'TokenPurchase',
                    exchangeAddress: fromId,
                    user: toId,
                    tokenSymbol: 'ETH',
                    timestamp: currentTimestamp,
                    __typename: 'Transaction'
                };
                const newTxnSet = [
                    ...fromUserResult.transactions,
                    newTxnFromUser
                ]

                const data = {
                    ...fromUserResult,
                    transactions: _.orderBy(newTxnSet, 'timestamp', 'desc')
                }

                cache.writeQuery({ query: fromUserQuery, data });
            }

            const updateTxnSetToUser = () => {
                const toUserQuery = gql`
                    query GetUserTxs {
                        transactions(
                            where: {
                                user: "${toId}"
                            },
                            first: 10,
                            orderBy: timestamp,
                            orderDirection: desc
                        ) {
                            id,
                            event,
                            exchangeAddress,
                            ethAmount,
                            timestamp,
                            tokenSymbol,
                            user
                        }
                    }
                    
                `;
                const toUserResult = cache.readQuery({ query: toUserQuery });
                const currentTimestamp = moment.utc().format('X')
                const newTxnToUser = {
                    id: currentTimestamp.toString() + toId,
                    ethAmount: amount,
                    event: 'EthPurchase',
                    exchangeAddress: fromId,
                    user: toId,
                    tokenSymbol: 'ETH',
                    timestamp: currentTimestamp,
                    __typename: 'Transaction'
                };
                const newTxnSet = [
                    ...toUserResult.transactions,
                    newTxnToUser
                ]

                const data = {
                    ...toUserResult,
                    transactions: _.orderBy(newTxnSet, 'timestamp', 'desc')
                }

                cache.writeQuery({ query: toUserQuery, data });
            }

            updateTxnSetFromUser()
            updateTxnSetToUser()
            
            return null;
        }
    }
}

export default resolvers

// const query = gql`
//     query GetUsers {
//         users(first: 20, skip: ${page * 20}) @client {
//             id,
//             exchangeBalances {
//                 ethDeposited,
//                 ethWithdrawn,
//                 ethBought,
//                 ethSold
//             },
//             txs {
//                 id,
//                 exchangeAddress,
//                 tokenAddress,
//                 ethAmount,
//                 tokenAmount,
//                 user
//             }
//         }
//     }
//     
// `;