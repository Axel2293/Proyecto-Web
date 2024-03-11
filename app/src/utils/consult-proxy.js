//Create class Consulting functions as a proxy to the database

class Consult {
  constructor(user, date, time, topic, description) {
    this.user = user;
    this.date = date;
    this.time = time;
    this.topic = topic;
    this.description = description;
  }
  //setters and getters
  get user() {
    return this._user;
  }

  set user(value) {
    this._user = value;
  }

  get date() {
    return this._date;
  }

  set date(value) {
    this._date = value;
  }

  get time() {
    return this._time;
  }

  set time(value) {
    this._time = value;
  }

  get topic() {
    return this._topic;
  }

  set topic(value) {
    this._topic = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  //CRUD functions for consulting
  
}
