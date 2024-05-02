function validateEmail(email) {
  const regex = /^[a-z]+.[a-z]+@iteso.mx$/;
  return regex.test(email);
}