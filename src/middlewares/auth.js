const jwt = require('jsonwebtoken');

module.exports =  async function auth(req , res, next) {
  const token = _.replace(req.headers.authorization, /^Bearer\s+/, '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = _.get(decoded, 'user');
  } catch (err) {

  }

  next();
}