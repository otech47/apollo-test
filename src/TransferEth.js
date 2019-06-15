import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const ADD_TXN = gql`
    mutation AddTxn($fromId: String!, $toId: String!, $amount: String!, $page: Int!) {
        addTxn(fromId: $fromId, toId: $toId, amount: $amount, page: $page) @client
    }
`

function TransferEth({ page }) {
    const [values, setValues] = React.useState({
        showInputs: false,
        fromId: '',
        toId: '',
        amount: '0'
    });

    const handleTransferClick = () => {
        if (!values.showInputs) {
            setValues({ ...values, showInputs: true })
        }
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    return (
        <>
            <Button
                variant='outlined'
                onClick={handleTransferClick}
            >
                Transfer ETH
            </Button>
            {values.showInputs &&
                <Grid container justify='center' spacing={8}>
                    <Grid item>
                        <TextField
                            label='From ID'
                            value={values.fromId}
                            onChange={handleChange('fromId')}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label='To ID'
                            value={values.toId}
                            onChange={handleChange('toId')}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label='Amount'
                            value={values.amount}
                            onChange={handleChange('amount')}
                        />
                    </Grid>
                    <Mutation
                        mutation={ADD_TXN}
                        variables={{
                            fromId: values.fromId,
                            toId: values.toId,
                            amount: values.amount,
                            page
                        }}
                    >
                        {addTxn => (
                            <Grid item>
                                <Button
                                    variant='contained'
                                    onClick={addTxn}
                                >
                                    Confirm
                              </Button>
                            </Grid>
                        )}
                    </Mutation>
                    
                    
                </Grid>
            }
        </>
    );
}

export default TransferEth;
