import { CONTACTS } from "../../data/dummyData";
import Contact from "../../models/Contact";
import {
  TOGGLE_FAVORITE,
  CREATE_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
} from "../actions/contacts";

const initialState = {
  contacts: [],
  favoriteContacts: [],
};

const contactsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CONTACT:
      const newContact = new Contact(
        Math.random().toString(),
        action.contactData.name,
        action.contactData.phone,
        action.contactData.email,
        action.contactData.address,
        false,
        action.contactData.image,
        action.contactData.notes
      );
      return { ...state, contacts: state.contacts.concat(newContact) };
    case UPDATE_CONTACT:
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
        action.contactData.image,
        action.contactData.notes
      );
      const updatedContactsList = [...state.contacts];
      updatedContactsList[contactIndex] = updatedContact;

      return { ...state, contacts: updatedContactsList };
    case DELETE_CONTACT:
      return {
        ...state,
        favoriteContacts: state.favoriteContacts.filter(
          (contact) => contact.id !== action.contactId
        ),
        contacts: state.contacts.filter(
          (contact) => contact.id !== action.contactId
        ),
      };
    case TOGGLE_FAVORITE:
      const existingIndex = state.favoriteContacts.findIndex(
        (contact) => contact.id === action.contactId
      );
      if (existingIndex >= 0) {
        const updatedFavContacts = [...state.favoriteContacts];
        updatedFavContacts.splice(existingIndex, 1);
        return { ...state, favoriteContacts: updatedFavContacts };
      } else {
        const contact = state.contacts.find(
          (contact) => contact.id === action.contactId
        );
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
