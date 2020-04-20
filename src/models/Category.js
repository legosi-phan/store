const mongoose = require('mongoose');

const SchemaCategory = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId
  },
  name: {type: String, required: true},
},{ timestamps: true })

module.exports = mongoose.model('category', SchemaCategory, '_category');