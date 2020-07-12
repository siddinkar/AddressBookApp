import React, { useState } from "react";
import { StyleSheet, Text, Touchable, View } from "react-native";
import { SearchBar } from "react-native-elements";

const SearchBarOBJ = (props) => {
  const [state, setState] = useState("");

  return (
    <View style={styles.header}>
      <SearchBar
        placeholder={props.placeholder}
        onChangeText={(text) => setState(text)}
        value={state}
        style={styles.bar}
        containerStyle={({ backgroundColor: "white" }, { height: 45 })}
        inputContainerStyle={
          ({ justifyContent: "center" },
          { borderRadius: 20, backgroundColor: "white" },
          { height: 30 })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "white",
  },
});

export default SearchBarOBJ;
