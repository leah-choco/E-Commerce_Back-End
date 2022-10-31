// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

//Within this file, I defined the associations between the models.

//Category has any products. Products would be deleted if Category is deleted.
Category.hasMany(Product, {
  foreignKey:'category_id',
  onDelete:'CASCADE',
});

// Products belongs to Category.
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete:'CASCADE',
});


// Products belongs to many Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: {
    model: ProductTag,
    unique: false
  },
  foreignKey: "product_id"
});

// Tags belongs to many Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
    unique: false
  },
  foreignKey: "tag_id"
});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
