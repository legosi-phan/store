const { Router } = require('express');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Ajv = require('ajv');


const validator = require('../nevable/helpers/validator');
const { JWT_EXP_TIME } = require('../constants');
const { createUserSchema } = require('../nevable/schemas');

const router = Router();

router.post('/', async (req, res, next) => {
  const data = req.body;
  const ajv = new Ajv();
  const validate = ajv.compile(createUserSchema);
  const valid = validate(data);
  if (!valid) {
    return res.status(400).send({
      message: 'Validate input failed',
      errors: validate.errors 
    });
  }

  const { email, username, password } = data;

  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: 'Invalid email'});
  }

  if (!validator.validUsername(username)) {
    return res.status(400).send({ message: 'Invalid username' });
  }

  if (!validator.validPassword(password)) {
    return res.status(400).send({ message: 'Invalid password' })
  }

  try {
    const user = await User.findOne({$or: [{ username }, { email }]}).exec();
    if (user) {
      if (user.username === username) {
        return res.status(400).send({ message: 'Username does exists' });
      } else if (user.email === email) {
        return res.status(400).send({ message: 'Email does exists' });
      }
    }
    
    const hashed = await bcrypt.hash(password, _.toNumber(process.env.SALT_ROUNDS));
    if (!hashed) {
      return res.status(400).send({ message: 'Hash password failed' })
    }

    const newUser = await User.create({ username, email, password: hashed });

    const userPayload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }

    const jwtoken = jwt.sign({user: userPayload}, process.env.JWT_SECRET, { expiresIn: JWT_EXP_TIME });
    if (!jwtoken) {
      return res.status(400).send({ message: 'Generate jwt failed' })
    }

    return res.status(200).send({
      access_token: jwtoken,
      user: userPayload
    });
    
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

router.post('/auth', async (req, res, next) => {
  const data = req.body;
  const { username, password } = data;
  
  if (!validator.validUsername(username)) {
    return res.status(400).send({ message: 'Username is invalid' });
  }

  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(400).send({ message: 'Username does not exists' });
    }
    
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(400).send({ message: 'Password is not correct' });
    }

    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email
    }

    const jwtoken = jwt.sign({user: userPayload}, process.env.JWT_SECRET, { expiresIn: JWT_EXP_TIME });
    if (!jwtoken) {
      return res.status(400).send({ message: 'Generate access token failed' });
    }

    return res.status(200).send({
      access_token: jwtoken,
      user: userPayload
    })
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

router.get('/me', async (req, res, next) => {
  const userId = _.get(req, 'user.id');
  try {
    const user = await User.findOne({_id: userId}).exec();
    if (!user) {
      return res.status(401).send({ message: 'Unauthorized' })
    }

    return res.status(200).send({
      id: user.id,
      email: user.email,
      username: user.username
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});


module.exports = router;