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

      if (currentDate >= expDate || !token) {
        props.navigation.navigate("Auth");
        return;
      }

      const expTime = new Date(expDate).getTime() - new Date().getTime();

      dispatch(authActions.authenticate(token, expTime));

      props.navigation.navigate("Main");
    };
    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.center}>
      <TouchableHighlight onPress={() => authActions.logout()}>
        <ActivityIndicator size="large" />
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartScreen;
