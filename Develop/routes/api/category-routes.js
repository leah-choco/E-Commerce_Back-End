const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');

// The `/api/categories` endpoint

//I wrote all the routes in this file. 

//This route finds all the categories. It includes Product as an association.
router.get('/', async (req, res) => {
  try{
    const categoryData = await Category.findAll({
      include: [{model: Product, }]
    });
    
    res.status(200).json(categoryData);

  }catch (err) {
    res.status(500).json(err);
  }
});

//This route finds one single category by it's id. It also includes Product as its association.
router.get('/:id', async (req, res) => {
  try{
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{model: Product, }]
    });

    if(!categoryData) {
      res.status(404).json({message: 'No category found with this id.'});
      return;
    }
    
    res.status(200).json(categoryData);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//This route creates a new category.
router.post('/',  async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);

  }catch (err){
    res.status(400).json(err);
  }
});

//This route updates a category by its id. 
router.put('/:id', async (req, res) => {
  try{
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if(!categoryData[0]) {
      res.status(404).json({ message: 'No category with this id.'});
      return;
    }
    
    res.status(200).json(categoryData);
  }catch (err) {
    res.status(500).json(err);
  }
});

//This route deletes a category by its id.
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if(!categoryData) {
      res.status(404).json({ message: 'No category found for this id.'});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
