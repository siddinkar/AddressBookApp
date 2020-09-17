import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { AsyncStorage } from "react-native";
import SearchBarOBJ from "../components/SearchBarOBJ";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import Icon from "react-native-vector-icons/FontAwesome5";
import HomeScreen from "./HomeScreen";
import * as authActions from "../store/actions/auth";
import { useDispatch } from "react-redux";

const FavoritesScreen = (props) => {
  const favContacts = useSelector((state) => state.contacts.favoriteContacts);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  if (favContacts.length === 0 || !favContacts) {
    return (
      <View style={styles.fallback}>
        <Text>No favorite contacts found. Start adding some!</Text>
      </View>
    );
  }

  if (error === "Login") {
    Alert.alert(
      "Session has expired",
      "You will be redirected to the Login page",
      [
        {
          text: "Ok",
          style: "default",
          onPress: () => {
            dispatch(authActions.logout());
          },
        },
      ]
    );
  }

  return (
    <View style={styles.screenMain}>
      {/*<View style={styles.screenTop}>
        <TextInputComponent onAddContact={addNameHandler} />
      </View>*/}
      <View style={styles.screenMid}>
        <View style={styles.bar}>
          <SearchBarOBJ placeholder="Search for Favorites" />
        </View>

        <FlatList
          keyExtractor={(item, index) => item.id}
          data={favContacts}
          renderItem={(itemData) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => {
                props.navigation.navigate({
                  routeName: "ContactInfo",
                  params: {
                    CONTACTID: itemData.item.id,
                    screen: "Fav",
                  },
                });
              }}
            >
              <Card
                id={itemData.item.id}
                title={itemData.item.name}
                phone={itemData.item.phone}
                email={itemData.item.email}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

FavoritesScreen.navigationOptions = (props) => {
  return {
    headerTitle: "Your Favorites",
    headerLeft: () => (
      <View style={({ flex: 1 }, { justifyContent: "flex-start" })}>
        <Icon.Button
          size={22}
          name="ellipsis-h"
          style={styles.searchButton}
          onPress={() => {}}
          color={"#007aff"}
        />
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: "center",
    marginVertical: 10,
    marginRight: 15,
    marginLeft: 15,
  },
  searchButton: {
    backgroundColor: "white",
    paddingRight: 0,
  },
  screenTop: {
    flex: 1,
    justifyContent: "flex-start",
  },
  screenMid: {
    flex: 8.5,
    justifyContent: "flex-start",
    paddingTop: 0,
    alignItems: "center",
  },
  screenBottom: { flex: 0.5, justifyContent: "flex-end" },
  screenMain: { flex: 1, backgroundColor: "#dfdfdf" },
  header: {
    flexDirection: "column",
    alignItems: "center",
  },
  bar: { width: "100%" },
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "200",
  },
});

export default FavoritesScreen;
