/*
This file handles all the api requests dealing with creating, updating, deleting contacts.
*/

import Contact from "../../models/Contact";

export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";
export const CREATE_CONTACT = "CREATE_CONTACT";
export const DELETE_CONTACT = "DELETE_CONTACT";
export const UPDATE_CONTACT = "UPDATE_CONTACT";
export const SET_CONTACTS = "SET_CONTACTS";

//This is the func taht first fetches all the current data for a given user in the database when the app starts
export const fetchProducts = () => {
  return async (dispatch, getState) => {
    //needs a token for authentication
    const token = getState().auth.token;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/contacts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      //special error that send you back to auth page
      if (response.status === 401) {
        throw new Error("Login");
      } else if (!response.ok) {
        throw new Error("Something went wrong");
      }
      //parse JSON data
      const resData = await response.json();
      const loadedContacts = [];
      const favLoadedContacts = [];
      //upload all the data reviced in JSON to memory to be changed in the application
      //THis sets the favorites and the non favorites based on database values
      for (const key in resData) {
        if (resData[key].isFav) {
          favLoadedContacts.push(
            new Contact(
              resData[key].public_id,
              resData[key].name,
              resData[key].phone,
              resData[key].email,
              resData[key].address,
              resData[key].isFav,
              resData[key].notes
            )
          );
        }
        loadedContacts.push(
          new Contact(
            resData[key].public_id,
            resData[key].name,
            resData[key].phone,
            resData[key].email,
            resData[key].address,
            resData[key].isFav,
            resData[key].notes
          )
        );
      }
      //deals with in memeory obj to display to user
      dispatch({
        type: SET_CONTACTS,
        contacts: loadedContacts,
        favoriteContacts: favLoadedContacts,
      });
    } catch (err) {
      throw err;
    }
  };
};

//This function specificalyy updates the isFav in the database
export const toggleFavorite = (id, isFav) => {
  return async (dispatch, getState) => {
    //needs token for auth
    const token = getState().auth.token;
    //send put request to update in api
    const response = await fetch("http://127.0.0.1:5000/api/contacts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        public_id: id,
        isFav: !isFav,
      }),
    });
    //special error that navs user to auth page if thrown
    if (response.status === 401) {
      throw new Error("Login");
    } else if (!response.ok) {
      throw new Error("Something went wrong");
    }
    console.log("request sent to api");
    //deals with in memeory obj to display to user
    dispatch({ type: TOGGLE_FAVORITE, contactId: id });
  };
};

//func delete contacts from memory and database
export const deleteContact = (id) => {
  return async (dispatch, getState) => {
    //needs token for auth
    const token = getState().auth.token;
    //Delete req send to api
    const response = await fetch("http://127.0.0.1:5000/api/contacts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        public_id: id,
      }),
    });
    //special error which navs user to auth page
    if (response.status === 401) {
      throw new Error("Login");
    } else if (!response.ok) {
      throw new Error("Something went wrong");
    }
    //deals with in memeory obj to display to user
    dispatch({ type: DELETE_CONTACT, contactId: id });
  };
};

//creates a contact in memory and in db through api requests
export const createContact = (
  fullName,
  phoneNum,
  emailAddress,
  homeAddress,
  isFavorite,
  notesForPerson
) => {
  return async (dispatch, getState) => {
    //needs token for auth
    const token = getState().auth.token;
    //post request sent to api
    const response = await fetch("http://127.0.0.1:5000/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        name: fullName,
        phone: phoneNum,
        isFav: isFavorite,
        email: emailAddress,
        address: homeAddress,
        notes: notesForPerson,
      }),
    });
    console.log("request sent to api");
    //special error code which sends user to auth page
    if (response.status === 401) {
      console.log("login err thrown");

      throw new Error("Login");
    } else if (!response.ok) {
      console.log("err thrown");
      throw new Error("Something went wrong");
    }
    //parses JSON data
    const resData = await response.json();
    console.log(resData);

    const contact = resData["data"];
    //uses parsed data to create obj in memeory for user to view in app
    dispatch({
      type: CREATE_CONTACT,
      contactData: {
        id: contact["public_id"],
        name: contact["name"],
        phone: contact["phone"],
        email: contact["email"],
        address: contact["address"],
        isFavorite: contact["isFav"],
        notes: contact["notes"],
      },
    });
  };
};

//updates a contact in memory and in db
export const updateContact = (
  id,
  fullName,
  phoneNum,
  emailAddress,
  homeAddress,
  notesForPerson
) => {
  return async (dispatch, getState) => {
    //needs token for auth
    const token = getState().auth.token;
    //updates values of the conact and makes a put req
    const response = await fetch("http://127.0.0.1:5000/api/contacts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        public_id: id,
        name: fullName,
        phone: phoneNum,
        email: emailAddress,
        address: homeAddress,
        notes: notesForPerson,
      }),
    });
    console.log("request sent to api");

    //code logs user out if thrown
    if (response.status === 401) {
      throw new Error("Login");
    } else if (!response.ok) {
      throw new Error("Something went wrong");
    }
    //deals with in memeory obj to display to user
    dispatch({
      type: UPDATE_CONTACT,
      conId: id,
      contactData: {
        name: fullName,
        phone: phoneNum,
        email: emailAddress,
        address: homeAddress,
        notes: notesForPerson,
      },
    });
  };
};
