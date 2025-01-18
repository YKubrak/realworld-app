export default class NewAccountModel {
  constructor(firstName, lastName, username, password) {
    this.data = {
      firstname: firstName,
      lastname: lastName,
      username: username,
      password: password,
      confirmPassword: password,
    };
  }
}