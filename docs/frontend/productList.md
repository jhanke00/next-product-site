# Product List component documentation

This document provides an overview of the ProductList component in the application,its features and usage instructions.

## Overview

The ProductList component is responsible for displaying all the large products data , facilitating product search, and providing detailed information through a modal/dialog on click of the product, paginator is implemented to avoid infinite scrolling.

## Code Explanation

### Link
![image](https://github.com/divya-12m/react-product-site/assets/46180437/6f591950-240a-4344-8872-0bbb96e4a391)

Updated a Link 'Product List' and specified the route path in the app/page.tsx.

### Route

In the pages directory , created a folder called product-list. Inside product-list folder, created a file called products.tsx.
ProductList component is added here.
User will be able to see the Product Lists on click of 'Product List' Link in the home page



### ProductList component

The ProductList Component is the main component handling the display and interaction with the list of products.It supports features such as pagination, searching, and modal display.

-Displaying all the mock data (large data) in the product list
 ![image](https://github.com/divya-12m/react-product-site/assets/46180437/9f9d9d8f-ecfe-4cda-b9ae-c1fb3ffc7253)

- Pagination to avoid infinite scrolling- Enables users to navigate through different pages of product list.
- ![image](https://github.com/divya-12m/react-product-site/assets/46180437/f8969b88-0095-4b35-bbce-9787b9c2c7e2)

  -Search- Users can search for specific products, and list updated dynamically based on the search query
  ![image](https://github.com/divya-12m/react-product-site/assets/46180437/640cd45d-98db-47e1-89e5-986a32d15dfb)

  -Modal- Clicking on a product card opens a modal displaying detailed information
  ![image](https://github.com/divya-12m/react-product-site/assets/46180437/09fdbce6-31d7-432c-b482-8e44f1734d99)

 

### Product Type

The 'Product' type defines the structure of individual products. It includes properties such as 'id', 'name','price', 'category','number of reviews', 'stock count', 'description', 'rating'

export type Product = {
id: number | string;
name: string;
price: number;
description: string;
category: string;
rating: number;
numReviews: number;
countInStock: number;
};

The 'id' property is updated to support both number and string types to accommodate variations in the provided data.
