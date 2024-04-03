const fs = require("fs");
const path = require("path");
const User = require("../models/user");

class UserControllerException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class UserController {
  static readUserData() {
    try {
      const users_path = path.join(__dirname, "../data/users.json");
      const data = fs.readFileSync(users_path, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading user data:", err);
      return [];
    }
  }

  static writeUserData(data) {
    try {
      const users_path = path.join(__dirname, "../data/users.json");
      const data = JSON.stringify(data, null, 2);
      fs.writeFileSync(users_path, data, "utf-8");
    } catch (err) {
      console.error("Error writing user data:", err);
    }
  }

  static getUsers() {
    return this.readUserData();
  }

  static userExist(user) {
    let data = this.readUserData();
    return data.some(
      (existing_user) =>
        existing_user.email === user.email && existing_user.role === user.role
    );
  }

  static findUserByEmail(email, role, data) {
    return data.find((user) => user.email === email && user.role === role);
  }

  static findUserById(id, data) {
    return data.find((user) => user.id === id);
  }

  static createUser(user) {
    console.log("Creating user...");
    const data = this.readUserData();

    // Check if the user already exists
    if (this.userExist(user)) {
      console.log("User already exists.");
      // If the user already exists, return false
      return false;
    }

    // If the user doesn't exist, create a new User instance
    let new_user = User.fromObject(user);

    // Add the new user to the userData array
    data.push(new_user);
    console.log("User created successfully.");
    // Write the updated userData array to the user_data file
    this.writeUserData(data);

    // Return true to indicate that the user was created successfully
    return true;
  }

  // IDEA: En roles crear un array con los roles que tiene permitido el usuario

  static updateUser(id, user_data) {
    let data = this.readUserData();
    let user_to_update = this.findUserById(id, data);

    if (user_to_update) {
      console.log("Updating user...");
      let update_flag = false;
      let valid_properties = User.validProperties;

      Object.keys(user_data).forEach((key) => {
        if (valid_properties.includes(key)) {
          if (key in user_to_update && key !== "id") {
            if (user_to_update[key] != user_data[key]) {
              // busca si el valor de la propiedad es diferente a el de todos los usuarios
              if (data.some((user) => user[key] === user_data[key])) {
                console.log("Property already exists in another user.");
                return false;
              }

              user_to_update[key] = user_data[key];
              update_flag = true;
            }
          }
        }
      });

      if (update_flag) {
        this.writeUserData(data);
        console.log("User updated successfully.");
        return user_to_update;
      } else {
        console.log("No properties to update.");
        return false;
      }
    } else {
      console.log("User to update not found.");
      return false;
    }
  }
}

module.exports = UserController;
