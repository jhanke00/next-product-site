# Frontend

# Product Page Listing details

This document provides an overview of the Product listing Page and Product Detail page.

# Introduction

Product listing allows us to view all the available products in the site and we can navigate back and forth to view the products using page navigation links where as Product Detail page is a dedicated single page for each of the products available in the site.

# Product Listing

Product Listing shows all the products available in mock data and they can be viewed using the navigation links. Each page displays 10 (this is customisable using sku_per_page variable) different products with a set of unique identifiers such as Name, description, id , ratings and stock details. The type for these identifiers are defined in src/type/products/index.ts

# Sku Details

Each product is linked to a dedicated separate page to display the contents of the SKU. The page also has a link to navigate to the main page. This page provides details that are not available in the Product Listing page.

# File changes Made

Single Product Page: /app/products/[productId]/page.tsx
Multiple Product Page: /app/products/page.tsx

# Styling

Styles/classNames for the page is used from global files available in the below file.
.next/static/css/app/layout.css
