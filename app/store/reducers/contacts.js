/*
This redux reducer handles the list of contacts and fav contacts
Its function are called by the corresponding file in the actions folder
*/

import Contact from "../../models/Contact";
import {
  TOGGLE_FAVORITE,
  CREATE_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
  SET_CONTACTS,
} from "../actions/contacts";
import { ActionSheet } from "native-base";

//creates the main store where the array of contacts the user has created is stored
const initialState = {
  contacts: [],
  favoriteContacts: [],
};

const contactsReducer = (state = initialState, action) => {
  switch (action.type) {
    //this case saves all the fetched contacts from the api into memory for the user to access
    case SET_CONTACTS:
      return {
        contacts: action.contacts,
        favoriteContacts: action.favoriteContacts,
      };
    //this case creates a new contact in the redux store after it has been created in the db
    case CREATE_CONTACT:
      //new obj created and added to list
      const newContact = new Contact(
        action.contactData.id,
        action.contactData.name,
        action.contactData.phone,
        action.contactData.email,
        action.contactData.address,
        action.contactData.isFavorite,
        action.contactData.notes
      );
      return { ...state, contacts: state.contacts.concat(newContact) };
    //this case updates a contact in the redux store
    case UPDATE_CONTACT:
      //finding the index of the contact in the array in redux store
      const contactIndex = state.contacts.findIndex(
        (con) => con.id === action.conId
      );
      const updatedContact = new Contact(
        state.contacts[contactIndex].id,
        action.contactData.name,
        action.contactData.phone,
        action.contactData.email,
        action.contactData.address,
        state.contacts[contactIndex].isFavorite,
        action.contactData.notes
      );
      //list of updated contacts is the new contacts array in store
      const updatedContactsList = [...state.contacts];
      updatedContactsList[contactIndex] = updatedContact;

      return { ...state, contacts: updatedContactsList };
    //this case deletes a contact from the store
    case DELETE_CONTACT:
      //gets original state and finds the contact with a given id
      return {
        ...state,
        favoriteContacts: state.favoriteContacts.filter(
          (contact) => contact.id !== action.contactId
        ),
        contacts: state.contacts.filter(
          (contact) => contact.id !== action.contactId
        ),
      };
    //this case favorites or unfavorites a contact
    case TOGGLE_FAVORITE:
      //find whether contact is already favorite
      const existingIndex = state.favoriteContacts.findIndex(
        (contact) => contact.id === action.contactId
      );
      //change its favorite status
      if (existingIndex >= 0) {
        const updatedFavContacts = [...state.favoriteContacts];
        updatedFavContacts.splice(existingIndex, 1);
        return { ...state, favoriteContacts: updatedFavContacts };
      } else {
        const contact = state.contacts.find(
          (contact) => contact.id === action.contactId
        );
        //new list becomes the favorites array in store.
        return {
          ...state,
          favoriteContacts: state.favoriteContacts.concat(contact),
        };
      }
    default:
      return state;
  }

  return state;
};

export default contactsReducer;
