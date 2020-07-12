import React from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  View,
  ImagePropTypes,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Button } from "react-native-elements";
import Colors from "../../constants/colors";

import SearchBarOBJ from "./SearchBarOBJ";

const Footer = (props) => {
  return (
    <View style={styles.footer}>
      <View style={styles.icon}>
        <Icon.Button
          size={25}
          name="home"
          style={styles.home}
          onPress={() => {}}
          color={"#007aff"}
        />
      </View>
      <View style={styles.icon}>
        <Icon.Button
          size={25}
          name="star"
          style={styles.favorites}
          onPress={() => {}}
          color={"#007aff"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    height: 60,
    paddingBottom: 0,
    backgroundColor: "#efefef",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  home: {
    color: "white",
    backgroundColor: "#efefef",
    paddingLeft: 7.5,
    paddingRight: 0,
    paddingBottom: 3,
    paddingTop: 3,
  },
  favorites: {
    color: "white",
    backgroundColor: "#efefef",
    paddingLeft: 7.5,
    paddingRight: 0,
    paddingBottom: 3,
    paddingTop: 3,
  },
  icon: {
    width: 100,
    alignItems: "center",
    textAlign: "center",
    paddingTop: 7.5,
  },
});

export default Footer;
