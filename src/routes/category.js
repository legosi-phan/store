const { Router } = require('express');
const { Category } = require('../models');

const { isAdmin } = require('../middlewares/policies');

const router = Router();

router.post('/', isAdmin, async (req, res) => {
  const data = req.body;
 
  const { name, parent } = data;

  if (!name) {
    return res.status(400).send({ message: 'Cate name is required and not be empty'});
  }
  
  const category = {
    name
  }

  try {
    if (parent) {
      const parentExists = await Category.findOne({_id: parent}).exec();
      if (!parentExists) {
        return res.status(400).send({ message: 'Parent cate do not exists'});
      }
      if (parentExists.parent) {
        return res.status(400).send({ message: 'Only support one child level'});
      }
  
      category['parent'] = parent;
    }
  
    const newCategory = await Category.create(category);
    
    return res.status(200).send(newCategory);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

});


router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    return res.status(200).send(categories);

  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
})

module.exports = router;