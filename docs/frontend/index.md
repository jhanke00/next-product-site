# Frontend

OverView -
Creating Contact Us Form, so that the User will be able to submit the Form with any help they need in application.

Additional packages installed -
SASS - scripting language used for external CSS styling
Bootstrap - Used for Styling the form

Brief -
Created a Route in home page for the user to navigate to contact Us Form.
Created Route inside app folder for to navigate to Contact Us page.
Created folder structure in src->components folder -
layout - this is the common component that adds main tag to the top level component acts as root component, so that all the children components will be included inside this component. later this component can be used to include the headers or to pass any global level providers through this component.
modules->main - this component is one level below the layout component , later this component can be used to pass any context providers to children component.
pages - All the page level components can be added here , one of which I have added contactUs page.
reusable - TODO, have not added this , but in future this can be used to all the reusable components that can be used in other components.
Created some utils common functions that can be reused in entire application -
emailValidation - function that takes input and validates if it is a valid email and returns boolean.
getStorage - function that returns the parsed value for the key input provided, if the storage value available. this function can be uesed for to get both session and local storage values.
setStorage - function that sets the key value to either local or session storage based on the inputs passed.
Created the Contact us form inside src->components->pages folder -
created form with the help of bootstrap.
Handling states for each input elements and error scenarios.
error handlings- user will not able submit form leaving the form empty and if the email is not valid.
success - user will be able to submit the form, if he has entered min one value and has entered a valid email and the form gets submitted with success message on top of the page.
