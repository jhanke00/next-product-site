# User Info API

This API endpoint retrieves user information based on the provided user ID.

## Endpoint

GET /api/user-info

- **Headers**
  - `user-id` (string): The ID of the user whose information is being requested.

## Responses

- **200 OK**
  - Success response with the user information.
- **400 Bad Request**
  - If the `user-id` header is missing.
- **404 Not Found**
  - If the user with the provided ID is not found.
- **500 Internal Server Error**
  - If user data is not found or any other internal server error occurs.

## Example

### Request

```bash
GET /api/user-info
Headers:
user-id: 2b6221e1-4141-4c83-98b2-8efbb0a7e355
```

### Response

```bash

{
    "id": "2b6221e1-4141-4c83-98b2-8efbb0a7e355",
    "firstName": "Laury",
    "lastName": "Torphy",
    "phoneNumber": "566.325.2621 x843",
    "email": "Laury_Torphy@yahoo.com"
}

```
