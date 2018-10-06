import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import logo from './assets/images/logo.svg';
import styles from './App.css';

import Chat from './components/Chat/Chat';
import Lobby from './containers/Lobby/Lobby';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className={styles.App}>
          <header className={styles['App-header']}>
            <a href="/">
              <img src={logo} className={styles['App-logo']} alt="logo" />
            </a>
            <h1 className={styles['App-title']}>Welcome to littlechat</h1>
          </header>
          <Route path="/" exact component={Lobby} />
          <Route path="/chat" exact component={Chat} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
