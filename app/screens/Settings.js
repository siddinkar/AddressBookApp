import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage,
  Button,
} from "react-native";
import { login } from "../store/actions/auth";
import * as authActions from "../store/actions/auth";
import { useDispatch } from "react-redux";

const Settings = (props) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.center}>
      <Button
        title="Logout"
        color="red"
        onPress={() => {
          dispatch(authActions.logout());
        }}
      />
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

export default Settings;
