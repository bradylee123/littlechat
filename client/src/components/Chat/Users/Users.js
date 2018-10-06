import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import styles from './Users.css';
import * as actionTypes from '../../../store/actions';

import User from './User/User';

class Users extends Component {

  constructor(props) {
    super(props);
    this.userListRef = React.createRef();
  }

  scrollHandler = (scrollHeight) => {
    const myDomNode = ReactDOM.findDOMNode(this.userListRef.current)
    myDomNode.scrollTo(0, scrollHeight);
  };

  componentDidMount() {
    const props = this.props;
    props.socket.on('updateUserList', function (userList) {
        props.onUpdateUserList(userList);
    });
  }

  componentDidUpdate() {
    let currentHeight = this.userListRef.current.clientHeight;
    let scrollHeight = this.userListRef.current.scrollHeight;
    let scrollTop = this.userListRef.current.scrollTop;
    let newMessageHeight = this.userListRef.current.childNodes[this.userListRef.current.childNodes.length-1].clientHeight;
    if (scrollHeight - currentHeight - newMessageHeight >= 0) {
      let lastMessageHeight = this.userListRef.current.childNodes[this.userListRef.current.childNodes.length-2].clientHeight;
      if (currentHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        this.scrollHandler(scrollHeight);
      }
    }
  }

  render() {
    return (
      <div className={styles.Users}>
        <div className={styles['user-list']} ref={this.userListRef}>
          <div id={styles['username']}>
            <strong>Username: {this.props.name}</strong>
          </div>
          <hr/>
          <div id={styles['users-header']}>
            <h4>Other Users:</h4>
          </div>
          {this.props.userList.filter(user => user !== this.props.name).map((username, index) => (
              <User
                  username={username}
                  key={index} />
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
    return {
        socket: state.socket,
        userList: state.userList,
        name: state.name
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onUpdateUserList: (userList) => dispatch({type: actionTypes.UPDATE_USERLIST, userList: userList})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
