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

const AddNavigator = createStackNavigator({
  Contacts: HomeScreen,
  ContactInfo: ContactInfoScreen,
  EditContact: EditContactScreen,
});

const FavNavigator = createStackNavigator({
  Favorites: FavoritesScreen,
  ContactInfo: ContactInfoScreen,
  EditContact: EditContactScreen,
});

const Navigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: AddNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return <Icon name="ios-home" size={28} color={tabInfo.tintColor} />;
        },
      },
    },
    Favorites: {
      screen: FavNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return <Icon name="ios-star" size={25} color={tabInfo.tintColor} />;
        },
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return (
            <Icon name="ios-settings" size={28} color={tabInfo.tintColor} />
          );
        },
      },
    },
  },
  {
    activeColor: "#007aff",
    shifting: true,
    inactiveColor: "#a1a1a1",
    barStyle: {
      backgroundColor: "white",
    },
  }
);

const Auth = createSwitchNavigator({
  Login: LoginScreen,
  Signup: SignupScreen,
});

const MainNavigator = createSwitchNavigator({
  Start: StartScreen,
  Auth: Auth,
  Main: Navigator,
});

export default createAppContainer(MainNavigator);
