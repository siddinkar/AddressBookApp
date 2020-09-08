/*
This screen displays the complete info of the contact you click on from the Home or Favorite Screen.
From this screen, you can nav back to Home or Favorite Screen, nav to the edit contact Screen, delete a contact, 
and favorite a contact.
*/

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { AsyncStorage } from "react-native";
import { Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import { toggleFavorite } from "../store/actions/contacts";
import * as contactActions from "../store/actions/contacts";
import * as authActions from "../store/actions/auth";
import { SMS } from "expo";

const ContactInfoScreen = (props) => {
  //global vars
  const availableContacts = useSelector((state) => state.contacts.contacts);
  const conId = props.navigation.getParam("CONTACTID");
  const selectedContact = availableContacts.find((con) => con.id === conId);
  const currentContactIsFav = useSelector((state) =>
    state.contacts.favoriteContacts.some((contact) => contact.id === conId)
  );
  const [error, setError] = useState(null);

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
  }

  const dispatch = useDispatch();

  //sending an sms

  //func to switch favorite status
  const toggleFavoriteHandler = useCallback(async () => {
    try {
      await dispatch(toggleFavorite(conId, currentContactIsFav));
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, conId, currentContactIsFav]);

  //functionality for deleting contact
  const deleteAContact = useCallback(async () => {
    try {
      await dispatch(contactActions.deleteContact(conId));
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, conId]);

  //send togglefavorite action to the header button
  useEffect(() => {
    props.navigation.setParams({ toggleFav: toggleFavoriteHandler });
  }, [toggleFavoriteHandler]);

  //send favorite status to header button
  useEffect(() => {
    props.navigation.setParams({ isFav: currentContactIsFav });
  }, [currentContactIsFav]);

  //Alert to confirm to delete contact
  const deleteContact = () => {
    Alert.alert(
      "Deleting Contact",
      "Are you sure you want to delete this contact?",
      [
        {
          text: "Cancel",
          style: "default",
          onPress: () => {
            console.log("Cancelled");
          },
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            deleteAContact();
            props.navigation.goBack();
          },
        },
      ]
    );
  };

  //JSX
  return (
    <ScrollView>
      <View style={styles.topSection}>
        <View style={styles.pfp}>
          <TouchableOpacity>
            <Image
              source={require("../assets/blankUser.png")}
              style={styles.pfpImage}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>
          {selectedContact ? selectedContact.name : ""}
        </Text>
        <View style={styles.actions}>
          <Icon.Button name="phone" style={styles.icon} onPress={() => {}} />
          <Icon.Button name="message" style={styles.icon} onPress={() => {}} />
          <Icon.Button name="email" style={styles.icon} onPress={() => {}} />
        </View>
      </View>
      <Divider />
      <View style={styles.middleSection}>
        <View style={styles.info}>
          <Text style={{ fontWeight: "600" }}>Phone</Text>
          <Text
            style={
              ({ fontWeight: "300" },
              {
                color: "#007aff",
              })
            }
          >
            {selectedContact ? selectedContact.phone : ""}
          </Text>
        </View>
        <Divider />
        <View style={styles.info}>
          <Text style={{ fontWeight: "600" }}>Email</Text>
          <Text style={{ fontWeight: "300" }}>
            {selectedContact ? selectedContact.email : ""}
          </Text>
        </View>
        <Divider />
        <View style={styles.info}>
          <Text style={{ fontWeight: "600" }}>Address</Text>
          <Text style={{ fontWeight: "300" }}>
            {selectedContact ? selectedContact.address : ""}
          </Text>
        </View>
        <Divider />
        <View style={styles.info}>
          <Text style={{ fontWeight: "600" }}>Notes</Text>
          <Text style={{ fontWeight: "300" }}>
            {selectedContact ? selectedContact.notes : ""}
          </Text>
        </View>
        <Divider />
      </View>
      <Divider />
      <TouchableOpacity
        style={styles.addtoFav}
        onPress={() =>
          props.navigation.navigate("EditContact", {
            contactId: conId,
          })
        }
      >
        <Text style={{ flex: 1, color: "#007aff" }}>Edit Contact</Text>
      </TouchableOpacity>
      <Divider />
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.delete} onPress={deleteContact}>
          <Text style={{ flex: 1, color: "red" }}>Delete Contact</Text>
        </TouchableOpacity>
        <Divider />
      </View>
      <Divider />
    </ScrollView>
  );
};

//This blcok controls the header and its buttons' functionality
ContactInfoScreen.navigationOptions = (props) => {
  const toggleFavorite = props.navigation.getParam("toggleFav");
  const isFavorite = props.navigation.getParam("isFav");
  return {
    title: "Details",
    mode: "modal",
    headerStyle: {
      backgroundColor: "white",
    },
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={isFavorite ? "ios-star" : "ios-star-outline"}
          iconSize={25}
          onPress={toggleFavorite}
        />
      </HeaderButtons>
    ),
  };
};

//JSX
const styles = StyleSheet.create({
  addtoFav: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 30,
    marginRight: 275,
    flex: 1,
  },
  delete: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 30,
    marginRight: 287,
    flex: 1,
  },
  topSection: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#efefef",
    flex: 5,
  },
  middleSection: { justifyContent: "center", flex: 3, marginBottom: 50 },
  bottomSection: {
    flexDirection: "row",
    flex: 4,
    alignItems: "center",
  },
  pfp: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    margin: 10,
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    paddingLeft: 9,
    paddingRight: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b1b1b1",
    width: 40,
    height: 40,
  },
  actions: {
    flexDirection: "row",
    marginTop: 0,
    marginBottom: 15,
    justifyContent: "space-evenly",
    width: "50%",
  },
  edit: { height: 30, marginTop: 5 },
  info: { marginTop: 7.5, marginBottom: 15, marginLeft: 30 },
  pfpImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});

export default ContactInfoScreen;
