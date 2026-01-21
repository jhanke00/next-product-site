/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const fs = require('fs');

mongoose
  .connect('mongodb://admin:admin@localhost:27017/product_api?authSource=admin')
  .then(() => console.log('[MongoDB] Connected to MongoDB'))
  .catch((err) => console.error('[MongoDB] Failed to Connect', err));

const usersSchema = new mongoose.Schema(
  {
    _id: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
  },
  { _id: false, versionKey: false },
);
const Users = mongoose.model('users', usersSchema);

const productsSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    price: String,
    description: String,
    category: String,
    rating: Number,
    numReviews: Number,
    countInStock: Number,
  },
  { _id: false, versionKey: false },
);
const Products = mongoose.model('products', productsSchema);

const ordersSchema = new mongoose.Schema(
  {
    user: { type: String, ref: 'User' },
    items: [
      {
        product: { type: String, ref: 'Product' },
        count: Number,
      },
    ],
    total: Number,
    time: Date,
  },
  { versionKey: false },
);
const Orders = mongoose.model('orders', ordersSchema);

const setupDatabase = async () => {
  try {
    await Users.deleteMany();
    await Products.deleteMany();
    await Orders.deleteMany();

    const usersData = JSON.parse(fs.readFileSync('./db/users.json', 'utf8'));
    const productsData = JSON.parse(
      fs.readFileSync('./db/products.json', 'utf8'),
    );
    const ordersData = JSON.parse(fs.readFileSync('./db/orders.json', 'utf8'));

    const users = usersData.map((user) => ({ _id: user.id, ...user }));
    await Users.insertMany(users);
    console.log('Users importados com sucesso.');

    const products = productsData.map((product) => ({
      _id: product.id,
      ...product,
    }));
    await Products.insertMany(products);
    console.log('Products importados com sucesso.');

    const orders = ordersData.map((order) => ({
      user: order.user,
      items: order.items.map((item) => ({
        product: item.id,
        count: item.count,
      })),
      total: order.total,
      time: new Date(order.time),
    }));
    await Orders.insertMany(orders);
    console.log('Orders importados com sucesso.');
  } catch (error) {
    console.error('[MongoDB] Failed on seed data', error);
  } finally {
    mongoose.connection.close();
  }
};

setupDatabase();
