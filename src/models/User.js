const mongoose = require('mongoose');

const SchemaUser = new mongoose.Schema({
  fullname: { type: String },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
},{ timestamps: true });

module.exports = mongoose.model('user', SchemaUser, '_user');