
const { User } = require('../../models');

module.exports = async function isAdmin(req , res, next) {
  const user = req.user;
  if (!user) {
    return res.status(403).send({ message: "Permission denied" });
  }

  const userId = user.id;
  try {
    const userExists = await User.findOne({_id: userId}).exec();
    if (!userExists) {
      return res.status(400).send( { message: 'User does not exists' });
    }
  } catch (error) {
    return res.status(400).send({ message: error.message })
  } 

  next();
}