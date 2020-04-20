const mongoose = require('mongoose');

const SchemaProduct = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { 
    type: Number,
    required: true, 
    validate: { 
      validator: Number.isInteger, 
      message: '{VALUE} is not  an integer value' 
    } 
  },
  discount: { 
    type: Number,
    default: 0,
    validate: { 
      validator: Number.isInteger, 
      message: '{VALUE} is not  an integer value' 
    } 
  }
},{ timestamps: true })

module.exports = mongoose.model('product', SchemaProduct, '_product');