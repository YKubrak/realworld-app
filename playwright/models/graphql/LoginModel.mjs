export default class LoginModel {
  constructor(username, password) {
    this.data = {
      "type": "LOGIN",
      "username": username,
      "password": password
    };
  }
}