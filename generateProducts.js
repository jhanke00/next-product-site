const { faker } = require("@faker-js/faker");
const fs = require("fs");

function generateProducts() {
  const products = [];

  for (let i = 0; i < 20000; i++) {
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

const products = generateProducts();
const json = JSON.stringify(products, null, 2);
fs.writeFileSync("products.json", json);
console.log("Products generated");
