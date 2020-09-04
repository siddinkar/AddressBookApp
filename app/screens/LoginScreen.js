/*
This the login screen where a user inputs their creds to get a key from the api to access their data from the database
*/

import React, { useState, useReducer, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { useCallback } from "react";
import Input from "../components/Input";

const FORM_UPDATE = "UPDATE";

// this watches the values, validity, and overall form validity of all the inputs on this screen
const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const LoginScreen = (props) => {
  //global vars
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [APIError, setAPIError] = useState("");

  //This is the setup values and vlaiditys of the reducer above
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      username: "",
      password: "",
    },
    inputValidities: {
      username: false,
      password: false,
    },
    formIsValid: true,
  });

  //This is a generic text handler that updates values on change of text in inputs.
  const textChangeHandler = (inputIdentifier, text) => {
    let isValid = true;

    dispatchFormState({
      type: FORM_UPDATE,
      value: text.trim(),
      isValid: isValid,
      input: inputIdentifier,
    });
  };

  //Checka all validities and updates the Redux State.
  //Also this sends the api request and catches all errors to display to user
  const submitHandler = async () => {
    if (formState.formIsValid) {
      setIsLoading(true);
      setPasswordError(false);
      setUsernameError(false);
      setAPIError(false);
      try {
        await dispatch(
          authActions.login(
            formState.inputValues.username,
            formState.inputValues.password
          )
        );
        props.navigation.navigate("Main");
      } catch (err) {
        setPasswordError(false);
        setUsernameError(false);
        if (err.message === "Please enter authorization information") {
          setPasswordError(true);
          setUsernameError(true);
          setAPIError(err.message);
        } else if (err.message === "User not found") {
          setUsernameError(true);
          setAPIError(err.message);
        } else if (err.message === "Incorrect password entered for user") {
          setPasswordError(true);
          setAPIError(err.message);
          dispatchFormState({
            type: FORM_UPDATE,
            value: "",
            isValid: false,
            input: "password",
          });
        } else {
          Alert.alert("Try again later", err.message, [
            { text: "Ok", style: "default" },
          ]);
          dispatchFormState({
            type: FORM_UPDATE,
            value: "",
            isValid: false,
            input: "password",
          });
        }
        setIsLoading(false);
      }
    }
  };

  //JSX
  return (
    <KeyboardAvoidingView style={styles.screen}>
      <View style={styles.textContainer}>
        <Text style={styles.welcome}>Welcome to your contacts!</Text>
        <Text style={styles.message}>Login to continue</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Enter username"
          isAPIError={usernameError}
          errorMessage={APIError}
          onInputChange={textChangeHandler.bind(this, "username")}
          value={formState.inputValues.username}
          autoCapitalize="none"
        />
        <Input
          label="Enter password"
          secureTextEntry={true}
          isAPIError={passwordError}
          errorMessage={APIError}
          onInputChange={textChangeHandler.bind(this, "password")}
          value={formState.inputValues.password}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Login" onPress={submitHandler} />
        )}
        <Button
          title="Don't have an account? Signup"
          onPress={() => {
            props.navigation.navigate("Signup");
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

//StyleSheet
const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: 400,
    height: 50,
    backgroundColor: "white",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    width: "80%",
    alignItems: "center",
  },
  welcome: { fontSize: 25, marginBottom: 25 },
  message: { fontSize: 18, marginBottom: 20 },
});

export default LoginScreen;
