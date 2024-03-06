# Frontend

Documentation on any Frontend capabilities or changes made.

For this new feature addition, few packages to be installed.

1. Boostrap - 5.3.3 - Provided great flexible and free to use templates and classes
2. SASS - CSS preprocessor that can be used for better and more efficient styling , also reducing lot of style code. This can be added in future releases.

# Layout -

Basic Layout consists of App folder and Src folders.

1. App - contains the routes and the basic layout of the pages.
2. src - Contains multiple folders
   1. reusable- Any reusable atom components is added here.
   2. constants - All texts will be added here and will be imported from here to the file needed.
   3. utils - contains the custom functions that might be used globally in the project.

# Header -

For now there is only a basic navigation header with only 2 routes added. Will be configured in the future.
Header is added in layout.tsx file.

# Contact Us Page -

This page is the new added feature.

Mutiple reusable components are being used to create this page such as input, buttons, alerts etc.

1. All the error handling is being done on submit click and will only submit on filling all necessay fields.
2. Field valdiation is being done on entering the value. Validation includes for email, Zip Code, City , State.
3. State is being handled using useState hook.
4. Submitted data is being stored in session Storage.
