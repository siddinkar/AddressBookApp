import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../store/actions/contacts";
import Swipeout from "react-native-swipeout";

const Card = (props) => {
  const conId = props.id;
  const currentContactIsFav = useSelector((state) =>
    state.contacts.favoriteContacts.some((contact) => contact.id === conId)
  );

  const dispatch = useDispatch();

  const toggleFavoriteHandler = useCallback(() => {
    dispatch(toggleFavorite(conId));
  }, [dispatch, conId]);

  return (
    <View style={{ ...styles.card }}>
      <View style={styles.cardLayoutLeft}>
        <Image
          source={require("../assets/blankUser.png")}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
        />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={styles.name}>
            <Text style={({ fontWeight: "bold" }, { fontSize: 18 })}>
              {props.title}
            </Text>
            <Text style={({ fontWeight: "200" }, { fontSize: 12 })}>
              {props.phone}
            </Text>
            <Text style={({ fontWeight: "200" }, { fontSize: 12 })}>
              {props.email}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardLayoutRight}>
        <Icon.Button
          underlayColor="transparent"
          size={20}
          name={currentContactIsFav ? "ios-star" : "ios-star-outline"}
          style={styles.action}
          color="black"
          onPress={toggleFavoriteHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: 380,
    height: 75,
    shadowColor: "black",
    shadowOffset: { width: 5, height: 6 },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    elevation: 20,
    backgroundColor: "white",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "space-between",
  },
  cardLayoutLeft: {
    flex: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  cardLayoutRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  name: {
    flex: 5,
    paddingLeft: 10,
    justifyContent: "center",
    paddingTop: 5,
  },
  action: {
    paddingRight: 0,
    padding: 0,
    width: 40,
    height: 40,
    backgroundColor: "white",
    justifyContent: "center",
  },
});

export default Card;
