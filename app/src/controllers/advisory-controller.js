const fs = require("fs"); // Módulo para operaciones de sistema de archivos
const path = require("path"); // Módulo para manipular rutas de archivos

const Advisory = require("../models/advisory"); // Importa la clase User del archivo user.js
const UserController = require("./user-controller");

class AdvisoryControllerException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class AdvisoryController {
  static readAdvisoryData() {
    try {
      const advisories_path = path.join(__dirname, "../data/advisories.json");
      const data = fs.readFileSync(advisories_path, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading advisory data:", err);
      return [];
    }
  }

  static writeAdvisoryData(data) {
    try {
      const advisories_path = path.join(__dirname, "../data/advisories.json");
      const data = JSON.stringify(data, null, 2);
      fs.writeFileSync(advisories_path, data, "utf-8");
    } catch (err) {
      console.error("Error writing advisory data:", err);
    }
  }

  // Método estático para obtener todos los usuarios
  static getAdvisories() {
    return this.readAdvisoryData();
  }

  // Método estático para buscar una asesoria por su ID
  static findAdvisoryById(id, data) {
    return data.find((advisory) => advisory.id === id);
  }

  // Método estático para verificar si una asesoria existe
  static advisoryExists(advisory) {
    let data = this.readAdvisoryData();
    return data.some(
      (existing_advisory) =>
        existing_advisory.user_student_id === advisory.user_student_id &&
        existing_advisory.user_teacher_id === advisory.user_teacher_id &&
        existing_advisory.subject === advisory.subject &&
        existing_advisory.date === advisory.date &&
        existing_advisory.time === advisory.time &&
        existing_advisory.status === advisory.status
    );
  }
  // IDEA: Verifcar que el estudiante y el profesor existan (X)
  // IDEA: Verificar que la fecha y hora no estén ocupadas ()
  // IDEA: Verificar que la fecha y hora no estén en el pasado ()
  // IDEA: Verificar que la hora no este ocupada por otra asesoria ()
  // Los horarios default son de 7:00 a 21:00 ()

  static createAdvisory(advisory) {
    console.log("Creating advisory...");
    const data = this.readAdvisoryData();

    // Check if the advisory already exists
    if (this.advisoryExists(advisory)) {
      console.log("Advisory already exists.");
      return false;
    } else {
      let advisory = Advisory.fromObject(advisory);
      if (
        UserController.userExistsById(advisory.student_id) &&
        UserController.userExistsById(advisory.teacher_id)
      ) {
        data.push(advisory);
        this.writeAdvisoryData(data);
        return advisory;
      }
    }
  }

  static updateAdvisory(id, advisory_data) {
    let advisories_data = this.readAdvisoryData();
    let advisory_to_update = this.findAdvisoryById(id, advisories_data);

    if (advisory_to_update){
      let advisory_data_keys = Object.keys(advisory_data);
      advisory_data_keys.forEach((key) => {
        advisory_to_update[key] = advisory_data[key];
      });
      this.writeAdvisoryData(advisories_data);
      return advisory_to_update;
    }
  }

  static updateStatus(id, status) {
    if (!this.advisoryExistsById(id)) {
      throw new AdvisoryControllerException("ERROR: Advisory not found");
    } else {
      let advisory_to_update = this.findAdvisoryById(id);
      advisory_to_update.status = status;
      fs.writeFileSync(users_path, JSON.stringify(advisories_data), "utf8");
      return advisory_to_update;
    }
  }
}

module.exports = AdvisoryController;
