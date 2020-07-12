import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import React from "react";
import HomeScreen from "../app/screens/HomeScreen";
import ContactInfoScreen from "../app/screens/ContactInfoScreen";
import EditContactScreen from "../app/screens/EditContactScreen";
import FavoritesScreen from "../app/screens/FavoritesScreen";
import Icon from "react-native-vector-icons/Ionicons";

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

const MainNavigator = createMaterialBottomTabNavigator(
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

export default createAppContainer(MainNavigator);
