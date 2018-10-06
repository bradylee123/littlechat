import * as actionTypes from './actions';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const initialState = {
  socket: socket,
  messages: [],
  userList: [],
  user: '',
  room: ''
}

const reducer = (state = initialState, action) => {
  switch ( action.type ) {
      case actionTypes.CREATE_ROOM:
          const newRoom = {
            room: action.room
          }
          return {
              ...state,
              room: newRoom.room
          }
      case actionTypes.CREATE_USER:
          const newUser = {
            username: action.name
          }
          return {
              ...state,
              name: newUser.username
          }
      case actionTypes.UPDATE_USERLIST:
          return {
              ...state,
              userList: action.userList
          }
      case actionTypes.ADD_MESSAGE:
        const newMessage = {
            time: action.time,
            from: action.from,
            text: action.text
        }
        return {
            ...state,
            messages: state.messages.concat( newMessage )
          }
      default:
        return state;
  }
}


export default reducer;
