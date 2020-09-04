/*
This redux reducer handles the token saved in memory.
Its function are called by the corresponding file in the actions folder
*/

import { AUTHENTICATE, LOGOUT } from "../actions/auth";
//creates a store for the token
const initialState = {
  token: null,
};
//based on which case is called, the store is updated in memory to change the token
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
