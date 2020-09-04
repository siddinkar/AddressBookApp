/*
This file deals with all the navigation and sets up the heirarchy of the screens
Uses many types o navigators to present new screens to the user
*/

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import React from "react";
import HomeScreen from "../app/screens/HomeScreen";
import ContactInfoScreen from "../app/screens/ContactInfoScreen";
import EditContactScreen from "../app/screens/EditContactScreen";
import FavoritesScreen from "../app/screens/FavoritesScreen";
import Icon from "react-native-vector-icons/Ionicons";
import LoginScreen from "../app/screens/LoginScreen";
import SignupScreen from "../app/screens/SignupScreen";
import StartScreen from "../app/screens/StartScreen";
import Settings from "../app/screens/Settings";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { View, Button, SafeAreaView } from "react-native";

//Subnavigator for control flow of editing/viewing a contact from home screen
const AddNavigator = createStackNavigator({
  Contacts: HomeScreen,
  ContactInfo: ContactInfoScreen,
  EditContact: EditContactScreen,
});

//Subnavigator for control flow of editing/viewing a contact from favorites screen
const FavNavigator = createStackNavigator({
  Favorites: FavoritesScreen,
  ContactInfo: ContactInfoScreen,
  EditContact: EditContactScreen,
});

//here, above two navigators are put together
const Navigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: AddNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          //given buttons for nav in footer
          return <Icon name="ios-home" size={28} color={tabInfo.tintColor} />;
        },
      },
    },
    Favorites: {
      screen: FavNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          //button for navigation in footer
          return <Icon name="ios-star" size={25} color={tabInfo.tintColor} />;
        },
      },
    },
    Settings: {
      //new screen added for loguout functionality
      screen: Settings,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return (
            //new button added for nav to "Settings" in footer
            <Icon name="ios-settings" size={28} color={tabInfo.tintColor} />
          );
        },
      },
    },
  },
  {
    //styling
    activeColor: "#007aff",
    shifting: true,
    inactiveColor: "#a1a1a1",
    barStyle: {
      backgroundColor: "white",
    },
  }
);

//navigator for the auth section
const Auth = createSwitchNavigator({
  Login: LoginScreen,
  Signup: SignupScreen,
});

//Main nav where all the navs are combined
const MainNavigator = createSwitchNavigator({
  Start: StartScreen,
  Auth: Auth,
  Main: Navigator,
});

export default createAppContainer(MainNavigator);
