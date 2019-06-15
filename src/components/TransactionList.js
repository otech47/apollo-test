import React from 'react';
import moment from 'moment';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const EmptyTxnList = () => {
    return (
        <ListItem>
            <ListItemText
                primary={`There are no transactions to display`}
                primaryTypographyProps={{ color: 'secondary' }}
            />
        </ListItem>
    )
}

class TransactionList extends React.Component {
    renderTxns = (txs) => {

        return txs.map(t => {
            let txnText = `${parseFloat(t.ethAmount).toFixed(16)} ETH `

            switch (t.event) {
                case 'EthPurchase':
                    txnText += `bought for ${t.tokenSymbol}`; break
                case 'TokenPurchase':
                    txnText += `sold for ${t.tokenSymbol}`; break
                case 'AddLiquidity':
                    txnText += `deposited to ${t.exchangeAddress}`; break
                case 'RemoveLiquidity':
                    txnText += `withdrawn from ${t.exchangeAddress}`; break
                default: break
            }
            return (
                <ListItem>
                    <ListItemText inset primary={`${moment(t.timestamp, 'X').format('MMM D, YYYY - hh:mma')}`}/>
                    <ListItemText primary={`${txnText}`}/>
                </ListItem>
            )
        })
    }
    renderResults = ({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return (
            <List>
                <ListItem>Last 10 transactions:</ListItem>
                {data.transactions.length == 0
                    ? <EmptyTxnList/>
                    : this.renderTxns(data.transactions)
                }
            </List>
        );
    }
    render() {
        const { userId } = this.props

        return (
            <Query
                query={gql`{
                    transactions(
                        where: {
                            user: "${userId}"
                        },
                        first: 10,
                        orderBy: timestamp,
                        orderDirection: desc
                    ) {
                        id,
                        event,
                        exchangeAddress,
                        ethAmount,
                        tokenSymbol,
                        timestamp,
                        user
                    }
                }`}
            >
                {this.renderResults}
            </Query>
        );
    }
}

export default TransactionList;
