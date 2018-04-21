const conn = require('./conn');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');
const Address = require('./Address');
const CreditCard = require('./CreditCard');

// Needed to fake data
const faker = require('faker');
const numCategories = 3;
const numProducts = 10;
// Model relationships

Product.belongsTo(Category);
Category.hasMany(Product);

//TODO: Order, LineItems

const sync = () => {
  return conn.sync({ force: true });
};

const seed = () => {
  return Promise.all([
    Product.create({
      name: 'Mascara',
      description: 'GrandeLASH - MD Lash Enhancing Serum',
      price: 65.00
    })
  .then(() => {
      // for(var i = 0; i < numCategories; i++){
      //   Category.create({
      //     name: faker.commerce.department()
      //   });
      // };
    })
  .then(()=>{
      for(var i = 0; i < numProducts; i++){
        Product.create({
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          price: faker.commerce.price()
        });
      };
    })

  ])
};

module.exports = {
  sync,
  conn,
  seed,
  models: {
    User,
    Category,
    Product,
    Cart,
    Address,
    CreditCard
  }
};
