import React, { useState } from "react";
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
} from "react-native";
import { SearchBar } from "react-native-elements";

import Footer from "../components/Footer";
import Card from "../components/Card";
import SearchBarOBJ from "../components/SearchBarOBJ";
import TextInputComponent from "../components/TextInputComponent";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSelector, useDispatch } from "react-redux";

const HomeScreen = (props) => {
  const [contactName, setContactName] = useState([]);
  const dispatch = useDispatch();

  const addNameHandler = (name) => {
    setContactName((currentName) => [
      ...contactName,
      { id: Math.random().toString(), value: name },
    ]);
  };

  const removeContact = (contactId) => {
    setContactName((currentName) => {
      return currentName.filter((contact) => contact.id !== contactId);
    });
  };

  const currentContacts = useSelector((state) => state.contacts.contacts);

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
          keyExtractor={(item, index) => item.id}
          data={currentContacts}
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
});

export default HomeScreen;
