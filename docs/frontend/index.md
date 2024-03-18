# Frontend

Documentation on any Frontend capabilities or changes made.

## Components ( @/src/componets)

1.    Breadcrumbs – Display the page Breadcrumbs
2.    ErrorPage – Shows errors or 'page not found' messages.
3.    Header – Header section of the application
4.    LeftNavigation – Left Navigation menu
5.    Pagination – Paginated data handling
6.    Search – Product search component
7.    Table – Table components to display products data in table format.
8.    ProductCard – To Display product details
9.    ProductSkeleton – For product page load 10. ProductCardSkeleton – for product details page load

## Utils (@/src/utils)

1.    breadcrumbsUtils.ts – To manage breadcrumbs across the application
2.    commonUtils.ts  - To manage common utility methods
3.    ProductUtils.ts – To manage product utility methods

## Types (@src/types)

1.    Updated types in Common and products

## Other Details

1.    API layer uses mockjson for products
2.    Tailwind CSS used for responsiveness
3.    Modularity is addressed with @components, @utils, @type  etc .
4.    The search will activate when the user presses Enter after typing, or upon submission using the search button.
5.    The category search will filter results based on the selection made.
6.    The search will always take into account the category and search query to retrieve data; at least one must be selected or entered.
7.    Pagination has a dropdown to navigate to any page number.

