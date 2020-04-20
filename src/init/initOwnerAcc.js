
const { validator } = require('../nevable/helpers'); 
const { JWT_EXP_TIME } = require('../constants');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = async function() {
  const { OWNER_ACC_USERNAME, OWNER_ACC_EMAIL, OWNER_ACC_PASSWORD } = process.env;

  if (!validator.isEmail(OWNER_ACC_EMAIL)) {
    throw new Error("Invalid email")
  }

  if (!validator.validUsername(OWNER_ACC_USERNAME)) {
    throw new Error("Invalid username")
  }

  if (!validator.validPassword(OWNER_ACC_PASSWORD)) {
    throw new Error("Invalid password")
  }

  const user = await User.findOne({$or: [{ username: OWNER_ACC_USERNAME }, { email: OWNER_ACC_EMAIL }]}).exec();
  if (user) {
    if (user.username === OWNER_ACC_USERNAME) {
      throw new Error('Username does exists');
    } else if (user.email === OWNER_ACC_EMAIL) {
      throw new Error('Email does exists');
    }
  }
  
  const hashed = await bcrypt.hash(OWNER_ACC_PASSWORD, _.toNumber(process.env.SALT_ROUNDS));
  if (!hashed) {
    throw new Error('Hash password failed');
  }

  return await User.create({ username: OWNER_ACC_USERNAME, email: OWNER_ACC_EMAIL, password: hashed });
}