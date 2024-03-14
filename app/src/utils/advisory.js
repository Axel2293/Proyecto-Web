//Create class Consulting functions as a proxy to the database
class AdvisoryException {
  constructor(message) {
    this.message = message;
    this.name = "UserException";
  }
}

class Advisory {
  constructor(student, teacher, date, time) {
    this.aid = aid();
    this.student = student;
    this.teacher = teacher;
    this.date = date;
    this.time = time;
  }
  
  //setters and getters
  

  get student() {
    return this._student;
  }

  set student(value) {
    this._student = value;
  }

  get teacher() {
    return this._teacher;
  }

  set teacher(value) {
    this._teacher = value;
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

  //CRUD functions for consulting
}
