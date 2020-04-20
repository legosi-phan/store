const mongoose = require('mongoose');
const colors = require('colors');


const Category = require('./Category');
const Product = require('./Product');
const CategoryProduct = require('./CategoryProduct');
const User = require('./User');
const ProductImage = require('./ProductImage');

async function SetupModel(uri) {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(colors.blue('⚡️ Connected to mongodb ⚡️'));
}

module.exports = { SetupModel, Category, Product, CategoryProduct, User, ProductImage };