const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

//I wrote all the routes within this file.

//This route finds all the tags. It's associated with Product.
router.get('/', async(req, res) => {
  try{
    const tagData = await Tag.findAll({
      include: [{model: Product, }]
    });
    res.status(200).json(tagData);
  }catch (err) {
    res.status(500).json(err);
  }
});

//This route finds a single tag by id. It's associated with Product.
router.get('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, }]
    });

    if(!tagData) {
      res.status(404).json({ message: `No tag found with that id.`});
      return;
    }

    res.status(200).json(tagData);
  }catch (err) {
    res.status(500).json(err);
  }
});

//This route creates a new tag.
router.post('/', async (req, res) => {
  try{
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  }catch(err){
    res.status(500).json(err);
  }
});

//This route updates a tag by id.
router.put('/:id', async (req, res) => {
  try{
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if(!tagData[0]) {
      res.status(404).json({message: `No tag found with that id.`});
      return;
    }

    res.status(200).json(tagData);
  }catch (err) {
    res.status(500).json(err);
  }
});

//This route deletes a tag by id. 
router.delete('/:id', async (req, res) => {
  try{
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if(!tagData) {
      res.status(404).json({message: `No tag found with that id.`});
      return;
    }
    res.status(200).json(tagData);
  }catch (err){
    res.status(500).json(err);
  }
});

module.exports = router;
