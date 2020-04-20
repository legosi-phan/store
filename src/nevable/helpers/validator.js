const validator = require('validator');

module.exports = {
  USERNAME_REG: /^[a-zA-Z0-9]{6,12}$/,
  PASSWORD_REG: /^(?=.{8,}$)(?=.*?[a-z])(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[!@#$%^&*]).*$/,
  
  isEmail(str) {
    return validator.isEmail(str);
  },

  validUsername(username) {
    return this.USERNAME_REG.test(username);
  },

  validPassword(password) {
    return this.PASSWORD_REG.test(password);
  }
}