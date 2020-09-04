/*
Generic Input component for login and signup screens
*/

import React, { useReducer, useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Foundation";
import { signup } from "../store/actions/auth";

const Input = (props) => {
  //add validity/error vars to potenially print error messages if they occur
  let validity = props.validity;
  let err = props.isAPIError;

  //JSX
  return (
    <View style={styles.formControl}>
      <View style={styles.input}>
        <TextInput
          {...props}
          placeholder={props.label}
          onChangeText={props.onInputChange}
          value={props.value}
          style={{ fontSize: 18, paddingLeft: 20, width: "90%" }}
        />
        {props.signup ? (
          <Icon
            name={validity ? "check" : "x"}
            color={validity ? "green" : "red"}
            size={20}
            style={{ paddingRight: 10 }}
          />
        ) : (
          <View />
        )}
      </View>
      {err ? (
        <Text style={{ color: "red", paddingLeft: 20 }}>
          {props.errorMessage}
        </Text>
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

//Stylesheet
const styles = StyleSheet.create({
  input: {
    height: 50,
    marginTop: 10,
    width: "100%",
    marginBottom: 1,
    backgroundColor: "#c1c1c1",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 25,
    flexDirection: "row",
  },
  formControl: {
    width: "100%",
  },
});

export default Input;
