/*
This is the main screen where the contacts are shown and where ou can navigate to the different screens
*/

import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  View,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  Button,
  Alert,
  Platform,
  Status,
  StatusBar,
  Dimensions,
  FlatList,
  ScrollView,
  TextInput,
  List,
  ActivityIndicator,
} from "react-native";
import { AsyncStorage } from "react-native";

import Card from "../components/Card";
import SearchBarOBJ from "../components/SearchBarOBJ";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSelector, useDispatch } from "react-redux";
import * as contactActions from "../store/actions/contacts";
import * as authActions from "../store/actions/auth";

const HomeScreen = (props) => {
  //global vars
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contactName, setContactName] = useState([]);
  const dispatch = useDispatch();

  //this func is called on load and fetches the values from the DataBase
  const loadContacts = useCallback(async () => {
    setError(null);
    try {
      await dispatch(contactActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
  });

  //This is the implementation of above func
  useEffect(() => {
    setIsLoading(true);
    loadContacts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, setError, setIsLoading]);

  //sets value of current contact to the array of all contacts in reducer in redux store
  const currentContacts = useSelector((state) => state.contacts.contacts);

  //This is running block that always checks if the error var gets updated to "Login"
  //If api sends login error, you are logged out
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
  } else if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  //JSX
  return (
    <View style={styles.screenMain}>
      {/*<View style={styles.screenTop}>
        <TextInputComponent onAddContact={addNameHandler} />
      </View>*/}
      <View style={styles.screenMid}>
        <View style={styles.bar}>
          <SearchBarOBJ placeholder="Search for Contacts" />
        </View>

        <FlatList
          onRefresh={loadContacts}
          refreshing={isLoading}
          data={currentContacts}
          keyExtractor={(item, index) => item.id}
          renderItem={(itemData) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => {
                props.navigation.navigate({
                  routeName: "ContactInfo",
                  params: {
                    CONTACTID: itemData.item.id,
                    screen: "Home",
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

//This handles all the header buttons, their visuals and their functionality
HomeScreen.navigationOptions = (props) => {
  return {
    title: "Contacts",
    headerStyle: {
      backgroundColor: "white",
    },
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
    headerRight: () => (
      <View style={({ flex: 1 }, { justifyContent: "flex-end" })}>
        <Icon.Button
          size={22}
          name="user-plus"
          style={styles.addButton}
          onPress={() => {
            props.navigation.navigate("EditContact");
          }}
          color={"#007aff"}
        />
      </View>
    ),
  };
};

//Stylesheet
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
  addButton: {
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
