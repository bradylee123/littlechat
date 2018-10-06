import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';

import styles from './Sender.css';
import { updateObject, checkValidity } from '../../../shared/utility';

class Sender extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messageForm: {
        message: {
          elementType: 'message',
          elementConfig: {
            type: 'text'
          },
          value: '',
          validation: {
              required: true
          },
          valid: false,
          touched: false
        }
      },
      formIsValid: false
    }
  }

  messageHandler = ( event ) => {
    event.preventDefault();
    this.props.socket.emit('createMessage', {
      text: this.state.messageForm['message'].value
    }, function () {
      this.setState(prevState => ({
        messageForm: {
          message: {
            ...prevState.messageForm.message,
            value: ''
          },
          formIsValid: false
        }
      }))
    }.bind(this));
  };

  messageChangedHandler = ( event ) => {
    const updatedFormElement = updateObject(this.state.messageForm['message'], {
        value: event.target.value,
        valid: checkValidity(event.target.value, this.state.messageForm['message'].validation),
        touched: true
    });
    const updatedMessageForm = updateObject(this.state.messageForm, {
        message: updatedFormElement
    });
    let formIsValid = true;
    formIsValid = updatedMessageForm['message'].valid && formIsValid;
    this.setState({messageForm: updatedMessageForm, formIsValid: formIsValid});
  }

  render() {
    const formElement = {
      id: this.state.messageForm.message,
      config: this.state.messageForm['message']
    }
    let form = (
        <form onSubmit={this.messageHandler} id={styles['message-form']}>
        <textarea
            key={formElement.id}
            value={formElement.config.value}
            id={styles['message-box']}
            onChange={(event) => this.messageChangedHandler(event)} />
          <button disabled={!this.state.formIsValid} id={styles['message-send-button']}>Send</button>
        </form>
    );
    return (
      <div className={styles.Sender}>
          {form}
      </div>
    )
  }
}

const mapStateToProps = state => {
    return {
        socket: state.socket,
        name: state.name,
        room: state.room
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddMessage: (time, from, text) => dispatch({type: actionTypes.ADD_MESSAGE, time: time, from: from, text: text})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Sender);
