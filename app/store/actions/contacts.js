import Contact from "../../models/Contact";

export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";
export const CREATE_CONTACT = "CREATE_CONTACT";
export const DELETE_CONTACT = "DELETE_CONTACT";
export const UPDATE_CONTACT = "UPDATE_CONTACT";
export const SET_CONTACTS = "SET_CONTACTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await fetch("http://127.0.0.1:5000/api/contacts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.status === 401) {
        throw new Error("Login");
      } else if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const resData = await response.json();
      const loadedContacts = [];
      const favLoadedContacts = [];
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

export const toggleFavorite = (id, isFav) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
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

    if (response.status === 401) {
      throw new Error("Login");
    } else if (!response.ok) {
      throw new Error("Something went wrong");
    }
    console.log("request sent to api");
    dispatch({ type: TOGGLE_FAVORITE, contactId: id });
  };
};

export const deleteContact = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
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

    if (response.status === 401) {
      throw new Error("Login");
    } else if (!response.ok) {
      throw new Error("Something went wrong");
    }

    dispatch({ type: DELETE_CONTACT, contactId: id });
  };
};

export const createContact = (
  fullName,
  phoneNum,
  emailAddress,
  homeAddress,
  isFavorite,
  notesForPerson
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
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

    if (response.status === 401) {
      throw new Error("Login");
    } else if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const resData = await response.json();
    console.log(resData);

    const contact = resData["data"];

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

export const updateContact = (
  id,
  fullName,
  phoneNum,
  emailAddress,
  homeAddress,
  notesForPerson
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
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
    if (response.status === 401) {
      throw new Error("Login");
    } else if (!response.ok) {
      throw new Error("Something went wrong");
    }

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
