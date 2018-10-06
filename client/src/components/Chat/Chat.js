import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Chat.css';

import Displayer from './Displayer/Displayer';
import Sender from './Sender/Sender';
import Users from './Users/Users';

const chat = ( props ) => {

  if (props.room === '') {
    window.location.href = '/';
  }
  return (
    <div className={styles.Chat}>
      <div className={styles.Displayer}>
        <Displayer />
      </div>
      <div className={styles.Users}>
        <Users />
      </div>
      <div className={styles.Sender}>
        <Sender />
      </div>
    </div>
  )
  
}

const mapStateToProps = state => {
    return {
        room: state.room
    };
};

export default connect(mapStateToProps)(chat);
