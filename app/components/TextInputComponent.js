/*
Text Input Component for input testing (not to be used in production)
*/

import React, { useState } from "react";
import { TextInput, Button, View, StyleSheet } from "react-native";

const TextInputComponent = (props) => {
  //hold inputted value in this
  const [enteredName, setEnteredName] = useState("");

  //update input value
  const nameInputHandler = (enteredText) => {
    setEnteredName(enteredText);
  };

  //JSX
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Add Contact"
        style={styles.input}
        onChangeText={nameInputHandler}
        value={enteredName}
      />
      <Button
        title="Add"
        onPress={props.onAddContact.bind(this, enteredName)}
      />
    </View>
  );
};

//StyleSheet
const styles = StyleSheet.create({
  inputContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  input: {
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
  },
});
export default TextInputComponent;
