const { Router } = require('express');
const { Product, ProductImage, Category, CategoryProduct } = require('../models');
const multer = require('multer');
const uniqueFilename = require('unique-filename');
const Ajv = require('ajv');
const fs = require('fs');

const { isAdmin } = require('../middlewares/policies');

const { createProductSchema } = require('../nevable/schemas');
const {
  ALLOW_IMAGE_EXT,
  LIMIT_IMAGE_SIZE,
  PRODUCT_IMAGE_DIR_PATH
} = require('../constants');

const upload = multer();
const router = Router();

router.post('admin/products', isAdmin, upload.array('images'), async (req, res) => {
  const data = req.body;
  const ajv = new Ajv();
  const validate = ajv.compile(createProductSchema);
  const valid = validate(data);
  if (!valid) {
    return res.status(400).send({
      message: 'Validate input failed',
      errors: validate.errors 
    });
  }
  for (let idx = 0; idx < req.files.length; ++idx) {
    const file = req.files[idx];
    if (file.size > LIMIT_IMAGE_SIZE) {
      res.status(400).send({ message: `Limit file size is ${LIMIT_IMAGE_SIZE / 1000000} MB`});
    }

    if (!ALLOW_IMAGE_EXT.includes(file.mimetype)) {
      const allowTypes_String = ALLOW_IMAGE_EXT.join(', ');
      res.status(400).send({ message: `Allow file type are ${allowTypes_String}`});
    }
  }

  const { name, description, discount = 0 } = data;
  const price = _.toNumber(data.price);
  const invalidPrice = !price || (price < 0) || _.isNaN(price) || !_.isNumber(price);
  if (invalidPrice) {
    res.status(400).send({ message: 'Price is number and >= 0'});
  }
  
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      discount
    });
    const productImages = [];

    const leadImage = req.files[0];    
    if (leadImage) {
      const leadImageFileName = `${Date.now()}-${leadImage.originalname}`;
      const leadImagePath = `${global['appDir']}/${PRODUCT_IMAGE_DIR_PATH}/${leadImageFileName}`;
      fs.writeFileSync(leadImagePath, leadImage.buffer);
      await ProductImage.create({
        productId: newProduct.id,
        url: leadImageFileName
      })

      productImages.push(leadImageFileName);
    }

    for (let idx = 1; idx < req.files.length; ++idx) {
      const image = req.files[idx];
      const fileName = `${Date.now()}-${image.originalname}`;
      const filePath = `${global['appDir']}/${PRODUCT_IMAGE_DIR_PATH}/${fileName}`;
      fs.writeFileSync(filePath, image.buffer);
      const newProductImage = await ProductImage.create({
        productId: newProduct.id,
        url: fileName
      });

      productImages.push(fileName);
    }

    return res.status(200).send({
      ..._.pick(newProduct, ['name', 'description', 'price', 'discount']),
      images: productImages  
    })
    
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

});

const DEFAUTL_SKIP_QUERY = '0';
const DEFAUTL_LIMIT_QUERY = '12';

router.get('admin/products', async (req, res) => {
  let { skip = DEFAUTL_SKIP_QUERY, limit = DEFAUTL_LIMIT_QUERY } = req.query;
  
  const numberRegex = /^[0-9]+$/;
  if (!numberRegex.test(skip) || !numberRegex.test(limit)) {
    return res.status(400).send({ message: 'Skip and limit query must be numberic and >= 0'});
  }
  
  skip = _.toInteger(skip);
  limit = _.toInteger(limit);
  
  try {
    const products = await Product.find({}).skip(skip).limit(limit).exec();
    return res.status(200).send(products);

  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
})

module.exports = router;