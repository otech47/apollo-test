import React from 'react';
import _ from 'lodash';

import TransferEth from './components/TransferEth';
import UserList from './components/UserList';

import './App.css';

class App extends React.Component {
    state = {
        pages: [0],
        openedTxnLists: []
    }
    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }

    trackScrolling = () => {
        const wrappedElement = document.getElementById('root');
        if (wrappedElement.getBoundingClientRect().bottom <= window.innerHeight) {

            // Delays the next infinite scroll load to prevent
            // multiple pages loading at once
            document.removeEventListener('scroll', this.trackScrolling);
            window.setTimeout(() => {
                document.addEventListener('scroll', this.trackScrolling);
            }, 2000)

            // Add another page of users
            this.setState({
                pages: [
                    ...this.state.pages,
                    this.state.pages.length + 1
                ]
            })
            
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
        return (
            <div className='App'>
                <TransferEth/>
                {this.renderUserLists()}
                
            </div>
        );
    }
}

export default App;
