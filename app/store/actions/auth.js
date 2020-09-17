/*
This the actions section of the redux store
This file handles all the api requests dealing with the user and the authentication process
This sends all the api requests, adds values to memory and saves tokens to the async storage
*/

import { encode } from "base-64";
import { AsyncStorage } from "react-native";
import { DatePickerIOSBase } from "react-native";

let timer;

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

//This function authenticates the user and sets a timer for auto logout. It also saves the token generated
//by the api to memeory
export const authenticate = (token, expirationTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expirationTime));
    dispatch({ type: AUTHENTICATE, token: token });
  };
};

//This is the api call which creates a new account in the data base. This also logs you in and authenticates
export const signup = (username, password) => {
  return async (dispatch) => {
    //singup
    const responseOne = await fetch("http://127.0.0.1:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    //check if api sent errors
    if (!responseOne.ok) {
      const errorData = await responseOne.json();
      throw new Error(errorData.message);
    } else {
      //if no errors, login and recieve token
      const responseTwo = await fetch("http://127.0.0.1:5000/api/login", {
        method: "GET",
        headers: {
          Authorization: "Basic " + encode(username + ":" + password),
        },
      });
      //check if errors have been thrown by api
      if (!responseTwo.ok) {
        throw new Error("Could not authorize");
      } else {
        //parse JSON data to extract info from api
        const resData = await responseTwo.json();
        const token = resData["token"];
        const expiry = resData["expiresIn"];
        const exp = expiry.substring(0, 23) + "Z";
        const expTime = new Date(exp).getTime() - new Date().getTime();
        //authenticate using the info sent by api
        dispatch(authenticate(token, expTime));
        //save the token to the async storage for reuse and auto login
        saveDataToStorage(token, exp);
      }
    }
  };
};

//This function logs a user in
export const login = (username, password) => {
  return async (dispatch) => {
    //first fetch response to get and save token
    const responseTwo = await fetch("http://127.0.0.1:5000/api/login", {
      method: "GET",
      headers: {
        Authorization: "Basic " + encode(username + ":" + password),
      },
    });
    //check for api errors
    if (!responseTwo.ok) {
      const errorData = await responseTwo.json();
      throw new Error(errorData.message);
    } else {
      //parse JSON data to extract info from api
      const resData = await responseTwo.json();
      const token = resData["token"];
      const expiry = resData["expiresIn"];
      const exp = expiry.substring(0, 23) + "Z";
      const expTime = new Date(exp).getTime() - new Date().getTime();
      //authenticate using the info sent by api
      dispatch(authenticate(token, expTime));
      //save the token to the async storage for reuse and auto login
      saveDataToStorage(token, exp);
    }
  };
};

//tthis is the logout func which deletes the token from the memeory and async storage so you can no longer access the api
export const logout = () => {
  clearTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

//this func cancels the logout timer
const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

//this func set the logout timer after which the user is auto logged out
const setLogoutTimer = (expTime) => {
  return async (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
      console.log("logged out");
    }, expTime);
  };
};

//This fucntion saves the token sent by the api to the asyznc storage
const saveDataToStorage = (token, date) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      expDate: date,
    })
  );
};
