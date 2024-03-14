# Frontend

Documentation on any Frontend capabilities or changes made.

## Overview

The 'List of Products' screens displays all the products enlisted in the mock files. To avoid infinite scroll (as the list of product is huge), the list includes pagination as well. Pagination can be seen at the end of the page where it shows (for example) -
Showing 11 - 20 of 10050
< Page 2 of 1005 >
In this example, 10 products are displayed per page (currently the 2nd page is displayed) and on clicking the next/previous button we see the next 10 set/previous 10 set of products.
The Previous < button is not shown when we are displaying the first page with first set of products
The Next > button is not shown when we are displaying the last page with last set of products

Each product in the list screen displays only its Name and Price. There is a 'See more...' text which signifies user that the product has a lot more information to show. The User will have to click on one particular product to see the detailed information about the product.

When the user clicks on any product, the user will be redirected to a details page where it displays all the information related to the product. The user can also go back to the 'List of products' screen from the details page as it has a 'Go to Products' link.

## Workflow and Files used

app\products\page.tsx :

1. Displaying list of products from 'src/mock/small/products.json' & 'src/mock/large/products.json'.
2. Assuming the page size as 10 and current page number as 1, calculated the first product index & last product index of the page. Calculated total pages and products to be displayed per page.
3. Using a map function displayed all the products for the page.
4. For any product details that is shown here is imported from component '/src/components/Products/productDetails'.
5. Provided a route to the product, on clicking it will redirect to product details screen 'app\products\[productId]\page.tsx'.

app\products\[productId]\page.tsx :

1. Displaying the product details here which is again imported from component '/src/components/Products/productDetails'.
2. Since we are sending dynamic productId in params from the previous screen, here we are finding the product id from the mock data and fetching the product information from the mock data. This way we can determine any 'Invalid product'.
3. The user can also go back to the 'List of products' screen from this page as it has a 'Go to Products' link.

src\components\Products\productDetails.tsx :

1. Component displays all the information of the particular product.
2. Displays only Product name & Product price for the list screen.
3. Displays all the information of the product for the details screen.

app\products\products.module.css :

1. Some custom styles are written for the UI

public\next.png :

1. Imported icon for pagination

public\previous.png :

1. Imported icon for pagination
