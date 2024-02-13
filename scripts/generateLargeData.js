const { faker } = require('@faker-js/faker');
const { randomInt } = require('crypto');
const fs = require('fs');

function generateProducts() {
  const products = [];

  for (let i = 0; i < 10000; i++) {
    const product = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      rating: faker.number.float({ min: 0, max: 5 }),
      numReviews: faker.number.int({ min: 0, max: 100 }),
      countInStock: faker.number.int({ min: 0, max: 100 }),
    };

    products.push(product);
  }

  return products;
}

function generateUsers() {
  const users = [];

  for (let i = 0; i < 1000; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = {
      id: faker.string.uuid(),
      firstName,
      lastName,
      phoneNumber: faker.phone.number(),
      email: faker.internet.email({ firstName, lastName }),
    };

    users.push(user);
  }

  return users;
}

function generateOrders(users, products) {
  const orders = [];

  for (let i = 0; i < 50000; i++) {
    const items = [];
    let total = 0;

    for (let p = 0; p < randomInt(1, 10); p++) {
      const { id, name, price } = products[randomInt(products.length)];
      const count = randomInt(1, 5);

      item = { id, name, price, count };

      items.push(item);
      total += price * count;
    }

    const order = {
      user: users[randomInt(users.length)].id,
      items,
      total,
      time: faker.date.anytime(),
    };

    orders.push(order);
  }

  return orders;
}

const products = generateProducts();
const users = generateUsers();
const orders = generateOrders(users, products);

const pJSON = JSON.stringify(products, null, 2);
const uJSON = JSON.stringify(users, null, 2);
const oJSON = JSON.stringify(orders, null, 2);

fs.writeFileSync('src/mock/large/products.json', pJSON);
console.log('Products Generated!');

fs.writeFileSync('src/mock/large/users.json', uJSON);
console.log('Users Generated!');

fs.writeFileSync('src/mock/large/orders.json', oJSON);
console.log('Orders Generated!');
