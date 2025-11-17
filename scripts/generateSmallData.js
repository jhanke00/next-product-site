const { faker } = require('@faker-js/faker');
const { randomInt } = require('node:crypto');
const fs = require('node:fs');

function generateProducts() {
  const products = [];

  for (let i = 0; i < 50; i++) {
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

  for (let i = 0; i < 20; i++) {
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

  for (let i = 0; i < 100; i++) {
    const items = [];
    let total = 0;

    for (let p = 0; p < randomInt(1, 10); p++) {
      const { id, name, price } = products[randomInt(products.length)];
      const count = randomInt(1, 5);

      const item = { id, name, price, count };

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

function generateLearning(products) {
  const learning = [];
  const resourceTypes = ['Guide', 'Tutorial', 'Documentation', 'Video Course', 'Reference', 'Best Practices'];
  const topics = ['Getting Started', 'Advanced', 'Troubleshooting', 'Integration', 'Configuration', 'API'];

  let resourceCounter = 1;

  // Generate 0-3 learning resources per product
  for (const product of products) {
    const numResources = randomInt(0, 4); // 0 to 3 inclusive

    for (let j = 0; j < numResources; j++) {
      const resourceType = resourceTypes[randomInt(resourceTypes.length)];
      const topic = topics[randomInt(topics.length)];

      const learningResource = {
        resourceId: `learn-s-${String(resourceCounter).padStart(3, '0')}`,
        productId: product.id,
        name: `${topic} ${resourceType}`,
        description: faker.commerce.productDescription(),
        resourceURI: faker.internet.url(),
        popularityScore: faker.number.int({ min: 1, max: 100 }),
      };

      learning.push(learningResource);
      resourceCounter++;
    }
  }

  return learning;
}

const products = generateProducts();
const users = generateUsers();
const orders = generateOrders(users, products);
const learning = generateLearning(products);

const pJSON = JSON.stringify(products, null, 2);
const uJSON = JSON.stringify(users, null, 2);
const oJSON = JSON.stringify(orders, null, 2);
const lJSON = JSON.stringify(learning, null, 2);

fs.writeFileSync('src/mock/small/products.json', pJSON);
console.log('Products Generated!');

fs.writeFileSync('src/mock/small/users.json', uJSON);
console.log('Users Generated!');

fs.writeFileSync('src/mock/small/orders.json', oJSON);
console.log('Orders Generated!');

fs.writeFileSync('src/mock/small/learning.json', lJSON);
console.log('Learning Content Generated!');
