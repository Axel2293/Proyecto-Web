const { nanoid } = require("nanoid");

class User {
  constructor(name, email, password, role, status = "pending") {
    this.id = nanoid();
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status = status;
  }

  // IDEA: Crear un array de fechas con horas no disponibles
  // IDEA: 
  static get validProperties() {
    return ["id", "name", "email", "password", "role", "status"];
  }

  static cleanObject(obj) {
    const validProperties = this.validProperties;
    const defaultValues = {
      name: "",
      email: "",
      password: "",
      role: "",
      status: "pending",
    };

    Object.entries(obj).forEach(([key, value]) => {
      if (!validProperties.includes(key)) {
        delete obj[key];
      } else if (value === undefined && key !== "id") {
        obj[key] = defaultValues[key];
      }
    });

    return obj;
  }

  static fromObject(obj) {
    const cleanedObj = this.cleanObject(obj);
    const { name, email, password, role, status } = cleanedObj;
    const newUser = new User(name, email, password, role, status);
    return newUser;
  }
}

module.exports = User;
