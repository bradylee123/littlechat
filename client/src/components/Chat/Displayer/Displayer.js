import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import styles from './Displayer.css';
import * as actionTypes from '../../../store/actions';

import Message from './Message/Message';

class Displayer extends Component {

  constructor(props) {
    super(props);
    this.displayerRef = React.createRef();
  }

  scrollHandler = (scrollHeight) => {
    const myDomNode = ReactDOM.findDOMNode(this.displayerRef.current)
    myDomNode.scrollTo(0, scrollHeight);
  };

  componentDidMount() {
    const props = this.props;
    props.socket.on('newMessage', function (message) {
        props.onAddMessage(message.createdAt, message.from, message.text);
    });
  }

  componentDidUpdate() {
    let currentHeight = this.displayerRef.current.clientHeight;
    let scrollHeight = this.displayerRef.current.scrollHeight;
    let scrollTop = this.displayerRef.current.scrollTop;
    let newMessageHeight = this.displayerRef.current.childNodes[this.displayerRef.current.childNodes.length-1].clientHeight;
    if (scrollHeight - currentHeight - newMessageHeight >= 0) {
      let lastMessageHeight = this.displayerRef.current.childNodes[this.displayerRef.current.childNodes.length-2].clientHeight;
      if (currentHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        this.scrollHandler(scrollHeight);
      }
    }
  }

  render () {
    return (
      <div className={styles.Displayer}>
        <div className={styles['chat-displayer']} ref={this.displayerRef}>
          {this.props.messages.map((message, index) => (
              <Message
                  from={message.from}
                  text={message.text}
                  key={index} />
          ))}
        </div>
      </div>
    )
  }
};

const mapStateToProps = state => {
    return {
        socket: state.socket,
        messages: state.messages
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddMessage: (time, from, text) => dispatch({type: actionTypes.ADD_MESSAGE, time: time, from: from, text: text})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Displayer);
