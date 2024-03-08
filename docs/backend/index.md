### Scope definition

Here, Save & retrieve user's messages in local storage

# Save messages to local storage

/src/components/CreateContactForm/index.jsx

let message = JSON.parse(localStorage.getItem('messages')) || [];
message.push(formData);
localStorage.setItem('messages', JSON.stringify(message));

# Fetch the messages from local stroage

/home/kseerala/next-product-site/app/messages
const messages = JSON.parse(localStorage.getItem('messages')) || [];
