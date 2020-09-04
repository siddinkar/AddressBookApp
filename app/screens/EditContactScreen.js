/*
This screen is for editing the contacts and adding contacts. It changes functinoality slightly based on where 
you nav from.
*/

import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Button,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { AsyncStorage } from "react-native";
import { Divider } from "react-native-elements";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import * as contactActions from "../store/actions/contacts";
import * as authActions from "../store/actions/auth";

const FORM_UPDATE = "UPDATE";

//This is the reducer which monitors and watches the changes in values. This watches values, validities and overall form validity
const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    if (!updatedValidities.name || !updatedValidities.phoneNum) {
      updatedFormIsValid = false;
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const EditContactScreen = (props) => {
  const contactId = props.navigation.getParam("contactId");
  const Contact = useSelector((state) =>
    state.contacts.contacts.find((con) => con.id === contactId)
  );

  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  //Action reducer that sets up reducer and updates it
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: contactId ? Contact.name : "",
      phoneNum: contactId ? Contact.phone : "",
      email: contactId ? Contact.email : "",
      address: contactId ? Contact.address : "",
      notes: contactId ? Contact.notes : "",
    },
    inputValidities: {
      name: contactId ? true : false,
      phoneNum: contactId ? true : false,
      email: contactId ? true : false,
      address: contactId ? true : false,
      notes: contactId ? true : false,
    },
    formIsValid: contactId ? true : false,
  });

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

  //Checka all validities and updates the Redux State. Also this sends the api request and catches all errors to display to user
  const submitHandler = useCallback(async () => {
    if (formState.formIsValid) {
      if (Contact) {
        try {
          await dispatch(
            contactActions.updateContact(
              contactId,
              formState.inputValues.name,
              formState.inputValues.phoneNum,
              formState.inputValues.email,
              formState.inputValues.address,
              formState.inputValues.notes
            )
          );
        } catch (err) {
          setError(err.message);
        }
      } else {
        try {
          await dispatch(
            contactActions.createContact(
              contactId,
              formState.inputValues.name,
              formState.inputValues.phoneNum,
              formState.inputValues.email,
              formState.inputValues.address,
              false,
              formState.inputValues.notes
            )
          );
        } catch (err) {
          setError(err.message);
        }
      }
      props.navigation.goBack();
    } else {
      Alert.alert(
        "Fill out required sections correctly",
        "Please add a name and valid phone number before creating a contact",
        [{ text: "Ok", style: "default" }]
      );
    }
  }, [dispatch, contactId, formState]);

  //sends the validation to the buttons at the header
  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  //Functionality for button that discards changes
  const discardChanges = () => {
    Alert.alert(
      "Discarding Changes",
      "Are you sure you want to discard changes to this contact?",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancelled");
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            props.navigation.goBack();
          },
        },
      ]
    );
  };

  //This func checks the format of the phone number to validate it.
  const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = phoneNumberString.replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    var matchsix = cleaned.match(/^(\d{3})(\d{3})$/);
    var matchseven = cleaned.match(/^(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    } else if (matchsix) {
      return [matchsix[1], "-", matchsix[2]].join("");
    } else if (matchseven) {
      return [matchseven[1], "-", matchseven[2]].join("");
    }
    console.log(cleaned);

    return cleaned;
  };

  //generic input validity checker
  const regTextChangeHandler = (inputIdentifier, text) => {
    let isValid = false;
    if (text.trim().length > 0) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_UPDATE,
      value: text,
      isValid: isValid,
      input: inputIdentifier,
    });
  };

  //This checks if the input formatted phone number is ready for submisiom
  const phoneHandler = (text) => {
    let isValid = false;
    var cleaned = text.replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    var matchsix = cleaned.match(/^(\d{3})(\d{3})$/);
    var matchseven = cleaned.match(/^(\d{3})(\d{4})$/);
    if (match || matchseven || matchsix) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_UPDATE,
      value: formatPhoneNumber(text),
      isValid: isValid,
      input: "phoneNum",
    });
  };

  //this checks if the email is valid based on its format
  const emailHandler = (text) => {
    let isValid = false;
    var match = text.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    if (text.length === 0) {
      isValid = true;
    } else if (text.trim().length > 0 && !match) {
      isValid = false;
    }
    dispatchFormState({
      type: FORM_UPDATE,
      value: text,
      isValid: isValid,
      input: "email",
    });
  };

  //JSX
  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View style={styles.screenMain}>
          <View style={styles.topSection}>
            <View style={styles.pfp}>
              <TouchableOpacity>
                <Image
                  source={require("../assets/blankUser.png")}
                  style={styles.pfpImage}
                />
              </TouchableOpacity>
            </View>
            <Button title={Contact ? "Change Photo" : "Add Photo"} />
            <TextInput
              style={styles.name}
              value={formState.inputValues.name}
              onChangeText={regTextChangeHandler.bind(this, "name")}
              placeholder="Enter Name"
              autoCorrect={false}
              maxLength={40}
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>
          <Divider />
          <View style={styles.middleSection}>
            <View style={styles.info}>
              <Text style={({ fontWeight: "600" }, { marginBottom: 3 })}>
                Phone
              </Text>
              <TextInput
                style={
                  ({ fontWeight: "300" },
                  {
                    color: formState.inputValidities.phoneNum
                      ? "#007aff"
                      : "#000",
                  })
                }
                value={formState.inputValues.phoneNum}
                onChangeText={phoneHandler}
                placeholder="Enter Phone Number"
                autoCorrect={false}
                maxLength={17}
                keyboardType="phone-pad"
                returnKeyType="done"
              />
            </View>
            <Divider />
            <View style={styles.info}>
              <Text style={({ fontWeight: "600" }, { marginBottom: 3 })}>
                Email
              </Text>
              <TextInput
                style={{ fontWeight: "300" }}
                value={formState.inputValues.email}
                onChangeText={emailHandler}
                placeholder="Enter Email"
                autoCorrect={false}
                maxLength={50}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
              />
            </View>
            <Divider />
            <View style={styles.info}>
              <Text style={({ fontWeight: "600" }, { marginBottom: 3 })}>
                Address
              </Text>
              <TextInput
                style={{ fontWeight: "300" }}
                value={formState.inputValues.address}
                onChangeText={regTextChangeHandler.bind(this, "address")}
                placeholder="Enter Address"
                autoCorrect={false}
                maxLength={90}
                numberOfLines={2}
                numberOfLines={2}
                autoCapitalize="none"
                returnKeyType="done"
              />
            </View>
            <Divider />
            <View style={styles.info}>
              <Text style={({ fontWeight: "600" }, { marginBottom: 3 })}>
                Notes
              </Text>
              <TextInput
                style={{ fontWeight: "300" }}
                value={formState.inputValues.notes}
                onChangeText={regTextChangeHandler.bind(this, "notes")}
                placeholder="Add Notes"
                autoCorrect={false}
                numberOfLines={6}
                maxLength={200}
                autoCorrect
                autoCapitalize="sentences"
                returnKeyType="done"
              />
            </View>
            <Divider />
          </View>
          <Divider />
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.delete} onPress={discardChanges}>
              <Text style={{ flex: 1, color: "red" }}>Discard Changes</Text>
            </TouchableOpacity>
            <Divider />
          </View>
          <Divider />
        </View>
        <View style={{ height: 400 }}>
          <View></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

//This handles the setup and functionlity of header buttons
EditContactScreen.navigationOptions = (props) => {
  const submitFunc = props.navigation.getParam("submit");

  return {
    headerTitle: props.navigation.getParam("contactId")
      ? "Edit Contact"
      : "Add Contact",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmard" : "ios-checkmark"
          }
          iconSize={35}
          onPress={submitFunc}
        />
      </HeaderButtons>
    ),
  };
};

//StyleSheet
const styles = StyleSheet.create({
  addtoFav: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 30,
    marginRight: 275,
    flex: 1,
  },
  delete: {
    flex: 1,
    paddingRight: 270,
    paddingLeft: 30,
    paddingTop: 15,
    paddingBottom: 15,
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
    flex: 1,
    marginTop: 0,
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: 20,
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

export default EditContactScreen;
