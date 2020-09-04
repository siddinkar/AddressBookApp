/*
Main file run by React Native
*/

import React, { useState } from "react";
import { enableScreens } from "react-native-screens";
import { createStore, combineReducers, applyMiddleware } from "redux";
import authReducer from "./app/store/reducers/auth";
import contactsReducer from "./app/store/reducers/contacts";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import NavigationContainer from "./navigation/NavigationContainer";

//enable navigation
enableScreens();

//creates a main reducer from the two separate ones in "../store/reducers"
const rootReducer = combineReducers({
  contacts: contactsReducer,
  auth: authReducer,
});

//builds the store
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

//main function
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
