### Scope definition

Create a contact us page having the following features:

1. A form containing name, email, subject, message
2. Form validation for each input field
3. The form should guide the user to enter valid input
4. Graceful error handling if the message cannot be saved / sent

# Generated navigation link in landing page

- Generated navigation link in landing page for End Users / Admin able to navigate Contact US form and List user message

Have added navigation link in below file

/app/page.tsx

### Pages

Generated the two page for Contact US form & List Users Message.

- /app/contact/page.tsx
- /app/messages/page.tsx

# Contact Us

- Generated the Contact us form.
- Form validation, guide, capture errors and success messages to display users.

#### Components

# Create contact us form

    /src/components/CreateContactForm/index.jsx

# Messages

    - List all user messages to review by maintainers
      /src/components/ListContactMessages/index.jsx
      /src/components/ShowContactMessages/index.jsx

# Style code update for Contact Us & List message.

    /app/globals.css
