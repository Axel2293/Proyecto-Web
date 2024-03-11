// User exception
class UserException {
  constructor(message) {
    this.message = message;
    this.name = "UserException";
  }
}

// Class User
class User {
  constructor(name, email, role, status) {
    if (validateEmail(email) === false) {
      throw new UserException("Invalid email");
    }
    this.uid = uid(name);
    this.name = name;
    this.email = email;
    this.role = role;
    this.status = status;
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
    this._name = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    if (validateEmail(value) === false) {
      throw new UserException("Invalid email");
    }
    this._email = value;
  }

  get role() {
    return this._role;
  }

  set role(value) {
    this._role = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }

  //Methods
  logIn() {
    console.log(`Hello, my name is ${this.name}`);
  }

  logOff() {
    console.log("Goodbye");
  }

  //CRUD functions for users
}
