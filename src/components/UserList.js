import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import TransactionList from './TransactionList';

const calculateEthByProp = (exchangeBalances, prop) => {
    return exchangeBalances.reduce((total, e) => {
        total += parseFloat(e[prop])
        return total
    }, 0).toFixed(16)
}

class UserList extends React.Component {
    renderUsers = (data) => {
        return data.users.map(({ id, exchangeBalances, txs }) => {
            const ethDeposited = calculateEthByProp(exchangeBalances, 'ethDeposited')
            const ethWithdrawn = calculateEthByProp(exchangeBalances, 'ethWithdrawn')
            const ethBought = calculateEthByProp(exchangeBalances, 'ethBought')
            const ethSold = calculateEthByProp(exchangeBalances, 'ethSold')

            let isOpen = false
            this.props.openedTxnLists.map(otl => {
                if (otl == id) isOpen = true
            })

            return (
                <>
                    <ListItem
                        button={!isOpen}
                        key={`user-${id}`} 
                        onClick={isOpen ? null : () => this.props.handleUserClick(id)}
                    >
                        <Grid container direction='column'>
                            <Grid item>
                                <ListItemText primary={`User ID: ${id}`}/>
                            </Grid>
                            <Grid item>
                                <ListItemText
                                    primary={`ETH Deposited: ${ethDeposited}`}
                                />
                            </Grid>
                            <Grid item>
                                <ListItemText
                                    primary={`ETH Withdrawn: ${ethWithdrawn}`}
                                />
                            </Grid>
                            <Grid item>
                                <ListItemText
                                    primary={`ETH Bought: ${ethBought}`}
                                />
                            </Grid>
                            <Grid item>
                                <ListItemText
                                    primary={`ETH Sold: ${ethSold}`}
                                />
                            </Grid>
                        </Grid>
                        
                    </ListItem>
                    <Collapse in={isOpen} unmountOnExit>
                        <TransactionList
                            userId={id}
                            txs={txs}
                        />
                    </Collapse>
                </>
            )
        })
    }
    renderUserList = ({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        console.log(data)

        return (
            <List>
                {this.renderUsers(data)}
            </List>
        );
    }
    render() {
        const { page } = this.props

        return (
            <Query
                query={gql`{
                    users(first: 20, skip: ${page * 20}) {
                        id,
                        exchangeBalances {
                            ethDeposited,
                            ethWithdrawn,
                            ethBought,
                            ethSold
                        },
                        txs {
                            id,
                            exchangeAddress,
                            tokenAddress,
                            ethAmount,
                            tokenAmount,
                            user
                        }
                    }
                }`}
            >
                {this.renderUserList}
            </Query>
        );
    }
}

export default UserList;
