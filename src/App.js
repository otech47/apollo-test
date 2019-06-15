import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import _ from 'lodash';

import TransferEth from './TransferEth';
import UserList from './UserList';

import './App.css';

class App extends React.Component {
    state = {
        pages: [0],
        openedTxnLists: []
    }
    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    trackScrolling = () => {
        const wrappedElement = document.getElementById('root');
        if (this.isBottom(wrappedElement)) {
            console.log('header bottom reached');
            document.removeEventListener('scroll', this.trackScrolling);
            this.setState({
                pages: [
                    ...this.state.pages,
                    this.state.pages.length + 1
                ]
            })
            window.setTimeout(() => {
                document.addEventListener('scroll', this.trackScrolling);
            }, 2000)
        }
    }

    toggleOpenedTxn = (txid) => {
        let updatedOpenedTxnList = [
            ...this.state.openedTxnLists,
            txid
        ]

        this.setState({ openedTxnLists: _.uniq(updatedOpenedTxnList) })
    }
    renderUserLists = () => {
        const { pages, openedTxnLists } = this.state

        return pages.map(p => {
            return (
                <UserList
                    openedTxnLists={openedTxnLists}
                    page={p}
                    handleUserClick={this.toggleOpenedTxn}
                />
            )
        })
    }
    render() {
        const { page } = this.state

        return (
            <div className='App'>
                <TransferEth page={page}/>
                {this.renderUserLists()}
                
            </div>
        );
    }
}

export default App;
