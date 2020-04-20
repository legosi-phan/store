const mongoose = require('mongoose');

const SchemaCategoryProduct = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
},{ timestamps: true })

module.exports = mongoose.model('category_product', SchemaCategoryProduct, '_category_product');