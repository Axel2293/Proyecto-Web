// User exception
class UserException {
  constructor(message) {
    this.message = message;
    this.name = "UserException";
  }
}

// Class User
class User {
  constructor(name, email, role, available) {
    this.uid = uid(name);
    this.name = name;
    this.email = email;
    this.role = role;
    this.available = available;
  }

  //setters and getters

  get uid() {
    return this._uid;
  }

  set uid(value) {
    UserException("Cannot change user id");
  }
  
  get name() {
    return this._name;
  }

  set name(value) {
    if (!value || value=='')
      throw new UserException("Name cannot be empty or undefined");
    this._name = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    if(!value || value=='')
      throw new UserException("Email connot be empty or undefined");
    this._email = email;
  }

  get role() {
    return this._role;
  }

  set role(value) {
    if(!value || value=='')
      throw new UserException("Role connot be empty or undefined");
    this._role = value;
  }

  get available() {
    return this._available;
  }

  set available(value) {
    this._available = value;
  }

  //Methods

  //CRUD functions for users
}
