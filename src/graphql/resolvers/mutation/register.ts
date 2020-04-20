import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { validator } from '@nevable/helpers';
import { User } from '@models';

export default async function registerResolver(parent, {username, email, password}, ctx) {

  if (!validator.isEmail(email)) {
    throw new Error('400 @ Invalid email.');
  }
  if (!validator.validUsername(username)) {
    throw new Error('400 @ Invalid username.');
  }
  if (!validator.validPassword(password)) {
    throw new Error('400 @ Invalid password.');
  }

  const user = await User.findOne({$or: [{ username }, { email }]}).exec();
  if (user) {
    if (user.username === username) {
      throw new Error('400 @ Username does exists.');
    } else if (user.email === email) {
      throw new Error('400 @ Email does exists.');
    }
  }
  
  const hashed = await bcrypt.hash(password, _.toNumber(process.env.SALT_ROUNDS));
  if (!hashed) {
    throw new Error('500 @ Hash password failed.');
  }

  const newUser = await User.create({ username, email, password: hashed });
  const userPayload = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email
  }

  const jwtoken = jwt.sign({user: userPayload}, process.env.JWT_SECRET, { expiresIn: '1h' });
  if (!jwtoken) {
    throw new Error('500 @ Generate JWT failed.');
  }

  return {
    jwt: jwtoken,
    user: userPayload
  }
}