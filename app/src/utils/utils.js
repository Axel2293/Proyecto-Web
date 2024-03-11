function validateEmail(email) {
  const regex = /^[a-z]+.[a-z]+@iteso.mx$/;
  return regex.test(email);
}

function uid(name) {
  const initials = name
    .match(/\b(\w)/g)
    .join("")
    .toLowerCase();

  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  return `${initials}-${randomNumber}`;
}
