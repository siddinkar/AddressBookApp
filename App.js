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
import { createStore, combineReducers } from "redux";
import contactReducer from "./app/store/reducers/contacts";
import contactsReducer from "./app/store/reducers/contacts";
import { Provider } from "react-redux";

enableScreens();

const rootReducer = combineReducers({
  contacts: contactsReducer,
});
const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({});
