import * as _ from 'lodash';
import {User } from '@models';

export default async function meResolver (parent, params, ctx) {
  const userId: string = _.get(ctx, 'req.user.id');
  const user = await User.findOne({_id: userId}).exec();
  if (!user) {
    throw new Error('401 @ Unauthorized.');
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username
  }
};