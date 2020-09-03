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
    let updatedFormIsValid = false;
    if (
      updatedValidities.username &&
      updatedValidities.password &&
      updatedValidities.verify
    ) {
      updatedFormIsValid = true;
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const SignupScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [APIError, setAPIError] = useState("");
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      username: "",
      password: "",
      verify: "",
    },
    inputValidities: {
      username: false,
      password: false,
      verify: false,
    },
    formIsValid: false,
  });

  const textChangeHandler = (inputIdentifier, text) => {
    let isValid = false;
    let cleaned = text.trim();
    if (inputIdentifier === "username") {
      if (cleaned.length >= 6) {
        isValid = true;
      }
    } else if (inputIdentifier === "password") {
      if (cleaned.length >= 6) {
        isValid = true;
      }
    } else if (inputIdentifier === "verify") {
      if (cleaned === formState.inputValues.password && cleaned.length > 0) {
        isValid = true;
      }
    }
    dispatchFormState({
      type: FORM_UPDATE,
      value: cleaned,
      isValid: isValid,
      input: inputIdentifier,
    });
  };

  const submitHandler = async () => {
    if (formState.formIsValid) {
      setIsLoading(true);
      setError(false);
      setAPIError("");
      try {
        await dispatch(
          authActions.signup(
            formState.inputValues.username,
            formState.inputValues.password
          )
        );
        props.navigation.navigate("Main");
      } catch (err) {
        if (err) {
          setAPIError(err.message);
          setError(true);
        }
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text style={styles.welcome}>Create an account!</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Enter a username"
          validity={formState.inputValidities.username}
          APIError={error}
          onInputChange={textChangeHandler.bind(this, "username")}
          value={formState.inputValues.username}
          errorMessage={APIError}
          autoCapitalize="none"
          signup={true}
        />
        <Input
          label="Enter a password"
          validity={formState.inputValidities.password}
          onInputChange={textChangeHandler.bind(this, "password")}
          value={formState.inputValues.password}
          autoCapitalize="none"
          signup={true}
        />
        <Input
          label="Confirm password"
          validity={formState.inputValidities.verify}
          onInputChange={textChangeHandler.bind(this, "verify")}
          value={formState.inputValues.verify}
          autoCapitalize="none"
          signup={true}
        />
      </View>

      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Sign up" onPress={submitHandler} />
        )}
        <Button
          title="Already have an account? Login"
          onPress={() => {
            props.navigation.navigate("Login");
          }}
        />
      </View>
    </View>
  );
};

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

export default SignupScreen;
