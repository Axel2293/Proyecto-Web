function validateEmail(email) {
  const regex = /^[a-z]+.[a-z]+@iteso.mx$/;
  return regex.test(email);
}

// Date 12 hour format as DD/MM/YYYY HH:MM:SS AM/PM with timezone of the client

function getFormattedDate() {
  const date = new Date();
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${
    date.getHours() >= 12 ? "PM" : "AM"
  } ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
}

function getFormattedDateFromDate(date) {
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${
    date.getHours() >= 12 ? "PM" : "AM"
  } ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
}


module.exports = {
  validateEmail,
  getFormattedDate,
  getFormattedDateFromDate
};