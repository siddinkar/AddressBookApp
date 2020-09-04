/*
Basic contact class to create Contact objects and store them
*/

class Contact {
  constructor(id, name, phone, email, address, isFavorite, notes) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.isFavorite = isFavorite;
    this.notes = notes;
  }
}

export default Contact;
