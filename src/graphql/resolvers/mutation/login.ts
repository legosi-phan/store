import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { validator } from '@nevable/helpers';
import { User } from '@models';

export default async function loginResolver(parent, {username, password}, ctx) {

  if (!validator.validUsername(username)) {
    throw new Error('400 @ Username is invalid.');
  }

  const user = await User.findOne({ username }).exec();
  if (!user) {
    throw new Error('404 @ Username does not exists.');
  }
  
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new Error('400 @ Password is not correct.');
  }

  const userPayload = {
    id: user.id,
    username: user.username,
    email: user.email
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