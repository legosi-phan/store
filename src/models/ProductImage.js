const mongoose = require('mongoose');

const SchemaProductImage = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  url: {
    type: String,
    required: true
  }
},{ timestamps: true })

module.exports = mongoose.model('product_image', SchemaProductImage, '_product_image');