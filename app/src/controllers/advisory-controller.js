const fs = require("fs"); // Módulo para operaciones de sistema de archivos
const path = require("path"); // Módulo para manipular rutas de archivos

const Advisory = require("../models/advisory"); // Importa la clase User del archivo user.js

// Ruta al archivo advisories.json que contiene los datos de los usuarios
const advisories_path = path.join(__dirname, "../data/advisories.json");
// Lee los datos del archivo advisories.json y los convierte en una cadena de texto
const advisories_json_data = fs.readFileSync(advisories_path, "utf8");
// Parsea la cadena de texto JSON en un objeto JavaScript
const advisories_data = JSON.parse(advisories_json_data);

class AdvisoryControllerException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class AdvisoryController {
  // Método estático para obtener todos los usuarios
  static getAdvisories() {
    return advisories_data;
  }

  // Método estático para buscar una asesoria por su ID
  static findAdvisoryById(id, show_message) {
    try {
      let advisory_to_find = advisories_data.find(
        (advisory) => advisory.id === id
      );
      if (advisory_to_find) {
        return advisory_to_find;
      } else {
        if (show_message) {
          throw new AdvisoryControllerException(
            "ERROR: Advisory not found by ID."
          );
        }
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  static createAdvisory(advisory) {
    try {
      const new_advisory = Advisory.fromObject(advisory);
      if (advisoryExistsById(id, false)) {
        throw new AdvisoryControllerException("ERROR: ID already exists.");
      }
      advisories_data.push(new_advisory);
      fs.writeFileSync(
        advisories_path,
        JSON.stringify(advisories_data),
        "utf8"
      );
      return new_advisory;
    } catch (error) {
      if (error instanceof AdvisoryControllerException) {
        console.error(error.message);
      } else {
        console.error("Error creating advisory:", error.message);
      }
      return false;
    }
  }

  static updateAdvisory(id, advisory_data) {
    if (!this.advisoryExistsById(id)) {
      throw new AdvisoryControllerException("ERROR: Advisory not found");
    } else {
      let update_flag = false;
      let advisory_to_update = this.findAdvisoryById(id);

      // Obtiene las claves de las propiedades públicas definidas en la clase User (excluyendo 'id')
      let valid_properties = Advisory.validProperties;

      // Itera sobre las claves en advisory_data
      Object.keys(advisory_data).forEach((key) => {
        if (valid_properties.includes(key)) {
          // Verifica si la propiedad existe en advisory_to_update y no es 'id'
          if (key in advisory_to_update && key !== "id") {
            if (advisory_to_update[key] != advisory_data[key]) {
              // Actualiza la propiedad en advisory_to_update
              advisory_to_update[key] = advisory_data[key];
              update_flag = true;
            }
          }
        }
      });

      if (!update_flag) {
        throw new AdvisoryControllerException("ERROR: No properties to update");
      } else {
        // Escribe los datos actualizados en el archivo users.json
        fs.writeFileSync(users_path, JSON.stringify(advisory_data), "utf8");
        return advisory_to_update; // Devuelve verdadero para indicar que el usuario ha sido actualizado correctamente
      }
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
