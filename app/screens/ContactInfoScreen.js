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
import { Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import { toggleFavorite } from "../store/actions/contacts";
import * as contactActions from "../store/actions/contacts";

const ContactInfoScreen = (props) => {
  const availableContacts = useSelector((state) => state.contacts.contacts);
  const conId = props.navigation.getParam("CONTACTID");
  const selectedContact = availableContacts.find((con) => con.id === conId);
  const currentContactIsFav = useSelector((state) =>
    state.contacts.favoriteContacts.some((contact) => contact.id === conId)
  );

  const dispatch = useDispatch();

  const toggleFavoriteHandler = useCallback(() => {
    dispatch(toggleFavorite(conId));
  }, [dispatch, conId]);

  useEffect(() => {
    props.navigation.setParams({ toggleFav: toggleFavoriteHandler });
  }, [toggleFavoriteHandler]);

  useEffect(() => {
    props.navigation.setParams({ isFav: currentContactIsFav });
  }, [currentContactIsFav]);

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
            props.navigation.goBack();
            dispatch(contactActions.deleteContact(conId));
          },
        },
      ]
    );
  };

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
