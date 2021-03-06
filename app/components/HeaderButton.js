/*
Set up custom header buttoms to use on Headers for multiple screens
*/

import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

const CustomHeaderButton = (props) => {
  return <HeaderButton {...props} IconComponent={Ionicons} color={"#007aff"} />;
};

export default CustomHeaderButton;
