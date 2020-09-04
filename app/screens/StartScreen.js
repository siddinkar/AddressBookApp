/*
This screens shows a loading symbol and decides which screen the user will see first.
If there is a token saved, they will be auto logged in as thier seesion is saved
If not, they wiill be sent to the authentication page.
*/

import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import { login } from "../store/actions/auth";
import * as authActions from "../store/actions/auth";
import { useDispatch } from "react-redux";
import { TouchableHighlight } from "react-native-gesture-handler";

const StartScreen = (props) => {
  const dispatch = useDispatch();

  //This fucntion runs on start and checks the async storage for a saved token.
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        props.navigation.navigate("Auth");
        return;
      }
      console.log(userData);

      const transformed = JSON.parse(userData);
      const { token, expDate } = transformed;
      const currentDate = new Date();
      console.log(currentDate);
      console.log(expDate);
      console.log(new Date() >= expDate);
      //this checks whether or not the tokena has expired
      if (currentDate >= expDate || !token) {
        props.navigation.navigate("Auth");
        return;
      }

      //checking the time in which this token expires to prepare for auto logout
      const expTime = new Date(expDate).getTime() - new Date().getTime();
      //authenitcating
      dispatch(authActions.authenticate(token, expTime));

      props.navigation.navigate("Main");
    };
    tryLogin();
  }, [dispatch]);

  //JSX
  return (
    <View style={styles.center}>
      <TouchableHighlight onPress={() => authActions.logout()}>
        <ActivityIndicator size="large" />
      </TouchableHighlight>
    </View>
  );
};

//Styles
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartScreen;
