# User Total Spent API

This API endpoint calculates the total amount spent by a user based on their orders.

## Endpoint

GET /api/user-total-spent

## Request Parameters

- **Headers**
  - `user-id` (string): The ID of the user whose total spent is being requested.

## Responses

- **200 OK**
  - Success response with the total amount spent by the user.
- **400 Bad Request**
  - If the `user-id` header is missing.
- **404 Not Found**
  - If no orders are found for the user.
- **500 Internal Server Error**
  - If any internal server error occurs.

## Example

### Request

```bash
GET /api/user-info
Headers:
user-id: 6dee7d92-9e43-4e20-9a41-8b815fb812a3
```

### Response

```bash

{
    "totalSpent": 14150
}

```
