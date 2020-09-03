import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  View,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  Button,
  Alert,
  Platform,
  Status,
  StatusBar,
  Dimensions,
  FlatList,
  ScrollView,
  TextInput,
  List,
} from "react-native";

import MainNavigator from "./navigation/Nav";
import { enableScreens } from "react-native-screens";
import { createStore, combineReducers, applyMiddleware } from "redux";
import authReducer from "./app/store/reducers/auth";
import contactsReducer from "./app/store/reducers/contacts";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import NavigationContainer from "./navigation/NavigationContainer";

enableScreens();

const rootReducer = combineReducers({
  contacts: contactsReducer,
  auth: authReducer,
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}

const styles = StyleSheet.create({});
