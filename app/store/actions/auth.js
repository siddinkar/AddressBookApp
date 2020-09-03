import { encode } from "base-64";
import { AsyncStorage } from "react-native";
import { DatePickerIOSBase } from "react-native";

let timer;

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

export const authenticate = (token, expirationTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expirationTime));
    dispatch({ type: AUTHENTICATE, token: token });
  };
};

export const signup = (username, password) => {
  return async (dispatch) => {
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

    if (!responseOne.ok) {
      const errorData = await responseOne.json();
      throw new Error(errorData.message);
    } else {
      const responseTwo = await fetch("http://127.0.0.1:5000/api/login", {
        method: "GET",
        headers: {
          Authorization: "Basic " + encode(username + ":" + password),
        },
      });

      if (!responseTwo.ok) {
        throw new Error("Could not authorize");
      } else {
        const resData = await responseTwo.json();
        const token = resData["token"];
        const expiry = resData["expiresIn"];
        const exp = expiry.substring(0, 23) + "Z";
        const expTime = exp.getTime() - new Date().getTime();
        dispatch(authenticate(token, expTime));
        saveDataToStorage(token, exp);
      }
    }
  };
};

export const login = (username, password) => {
  return async (dispatch) => {
    const responseTwo = await fetch("http://127.0.0.1:5000/api/login", {
      method: "GET",
      headers: {
        Authorization: "Basic " + encode(username + ":" + password),
      },
    });

    if (!responseTwo.ok) {
      const errorData = await responseTwo.json();
      throw new Error(errorData.message);
    } else {
      console.log("response is oks");

      const resData = await responseTwo.json();
      const token = resData["token"];
      const expiry = resData["expiresIn"];
      const exp = expiry.substring(0, 23) + "Z";
      const expTime = new Date(exp).getTime() - new Date().getTime();
      dispatch(authenticate(token, expTime));
      saveDataToStorage(token, exp);
    }
  };
};

export const logout = () => {
  clearTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expTime) => {
  return async (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
      console.log("logged out");
    }, expTime);
  };
};

const saveDataToStorage = (token, date) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      expDate: date,
    })
  );
};
