export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";
export const CREATE_CONTACT = "CREATE_CONTACT";
export const DELETE_CONTACT = "DELETE_CONTACT";
export const UPDATE_CONTACT = "UPDATE_CONTACT";

export const toggleFavorite = (id) => {
  return { type: TOGGLE_FAVORITE, contactId: id };
};

export const deleteContact = (id) => {
  return { type: DELETE_CONTACT, contactId: id };
};

export const createContact = (
  id,
  name,
  phone,
  email,
  address,
  image,
  notes
) => {
  return {
    type: CREATE_CONTACT,
    contactData: {
      id,
      name,
      phone,
      email,
      address,
      image,
      notes,
    },
  };
};

export const updateContact = (
  id,
  name,
  phone,
  email,
  address,
  image,
  notes
) => {
  return {
    type: UPDATE_CONTACT,
    conId: id,
    contactData: {
      name,
      phone,
      email,
      address,
      image,
      notes,
    },
  };
};
