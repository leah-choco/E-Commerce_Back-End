const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//I did not write all the routes within this file.

//This route finds all the products. I did write this. It's associated with Category and Tag using ProductTag.
router.get('/', async (req, res) => {
  try{
    const productData = await Product.findAll({
      include: [{model: Category},{model: Tag, through: ProductTag,}]
    });
    res.status(200).json(productData);
  }catch (err) {
    res.status(500).json(err);
  }
});

//This route finds a single product by id. I did write this. It's associated with Category and Tag through ProductTag.
router.get('/:id', async (req, res) => {
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category},{model: Tag, through: ProductTag,}]
    });

    if(!productData){
      res.status(404).json({message: 'No product found with this id.'});
      return;
    }
    
    res.status(200).json(productData);
  }catch (err) {
    res.status(500).json(err);
  }
});

// This creates a new product, but I did not write this route.
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//This updates a product by its id, but I did not write this.
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

//This route deletes a product by its id. I did write this.
router.delete('/:id', async (req, res) => {
  try{
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productData){
      res.status(404).json({message: 'No product found with that id.'});
      return;
    }
    res.status(200).json(productData);
  }catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
