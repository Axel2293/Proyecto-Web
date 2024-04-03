const { nanoid } = require("nanoid");
class Advisory {
  constructor(student_id, teacher_id, subject, date, time, status = "pending") {
    this.id = nanoid();
    this.student_id = student_id;
    this.teacher_id = teacher_id;
    this.subject = subject;
    this.date = date;
    this.time = time;
    this.status = status;
  }
  
  static get validProperties() {
    return [
      "user_student_id",
      "user_teacher_id",
      "subject",
      "date",
      "time",
      "status",
    ];
  }

  static cleanObject(obj) {
    let valid_properties = this.validProperties;
    let default_values = {
      user_student_id: "",
      user_teacher_id: "",
      subject: "",
      date: "",
      time: "",
      status: "pending",
    };

    Object.keys(obj).forEach((key) => {
      if (!valid_properties.includes(key)) {
        delete obj[key];
      }
    });

    valid_properties.forEach((prop) => {
      if (obj[prop] === undefined && prop !== "id") {
        obj[prop] = default_values[prop];
      }
    });

    return obj;
  }
  static fromObject(obj) {
    const cleanedObj = this.cleanObject(obj);

    const newUser = new Advisory(
      cleanedObj.user_student_id,
      cleanedObj.user_teacher_id,
      cleanedObj.subject,
      cleanedObj.date,
      cleanedObj.time,
      cleanedObj.status
    );

    return newUser;
  }
}

module.exports = Advisory;
