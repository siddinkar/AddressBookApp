/*
This is a file which helps with the auto logout functionality across the whole navigation stack
*/

import React, { useEffect, useRef } from "react";
import { NavigationActions } from "react-navigation";
import MainNavigator from "./Nav";
import { useSelector } from "react-redux";

const NavigationContainer = (props) => {
  //checks reference to see whether the auth token exists
  const navRef = useRef();
  const isAuth = useSelector((state) => !!state.auth.token);

  //constantly run to auto logout whenever "isAuth" becomes false
  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);

  //this reference is added to the main navigator obj
  return <MainNavigator ref={navRef} />;
};

//this is the final navigator passed to the App File
export default NavigationContainer;
