import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

import styles from './Lobby.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

import { updateObject, checkValidity } from '../../shared/utility';

class Lobby extends Component {

  constructor(props) {
    super(props);

    this.state = {
      joinForm: {
        username: {
          elementType: 'input',
          elementConfig: {
              type: 'text',
              placeholder: 'Your Name'
          },
          value: '',
          validation: {
              required: true
          },
          valid: false,
          touched: false
        },
        room: {
          elementType: 'input',
          elementConfig: {
              type: 'text',
              placeholder: 'Room Name'
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

  createRoom = ( event ) => {
    event.preventDefault();
    const params = {
      username: this.state.joinForm.username.value,
      room: this.state.joinForm.room.value
    }
    this.props.socket.emit('join', params, function (err) {
      if (err) {
        alert(err);
        window.location.href = '/chat';
        console.log(err);
      } else {
        console.log('Successfully created a room.');
      }
    });
    this.props.onCreateUser(params.username);
    this.props.onCreateRoom(params.room);
    this.props.history.push({pathname: '/chat'});
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(this.state.joinForm[inputIdentifier], {
        value: event.target.value,
        valid: checkValidity(event.target.value, this.state.joinForm[inputIdentifier].validation),
        touched: true
    });
    const updatedJoinForm = updateObject(this.state.joinForm, {
        [inputIdentifier]: updatedFormElement
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedJoinForm) {
        formIsValid = updatedJoinForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({joinForm: updatedJoinForm, formIsValid: formIsValid});
  }

  render () {
    const formElementsArray = [];
    for (let key in this.state.joinForm) {
        formElementsArray.push({
            id: key,
            config: this.state.joinForm[key]
        });
    }
    let form = (
        <form onSubmit={this.createRoom}>
            {formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)} />
            ))}
            <br/>
            <div id={styles.joinButton}>
              <Button btnType="Success" disabled={!this.state.formIsValid}>Enter</Button>
            </div>
        </form>
    );
    return (
        <div className={styles.Lobby}>
          <div className='container'>
            <h3 id={styles['lobby-header']}>Create a new room / Join a room</h3>
            {form}
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        socket: state.socket
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onCreateUser: (name) => dispatch({type: actionTypes.CREATE_USER, name: name}),
        onCreateRoom: (room) => dispatch({type: actionTypes.CREATE_ROOM, room: room})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
