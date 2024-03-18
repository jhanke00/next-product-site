# User Orders API

This API endpoint retrieves orders associated with the provided user ID.

## Endpoint

GET /api/user-orders

## Request Parameters

- **Headers**
  - `user-id` (string): The ID of the user whose orders are being requested.

## Responses

- **200 OK**
  - Success response with the orders associated with the user.
- **400 Bad Request**
  - If the `user-id` header is missing.
- **500 Internal Server Error**

  - If any internal server error occurs.

  ## Example

### Request

```bash
GET /api/user-orders
Headers:
user-id: c12f95dd-9446-48bc-b124-9e0142d53820
```

Response

```bash

[
    {
        "user": "c12f95dd-9446-48bc-b124-9e0142d53820",
        "items": [
            {
                "id": "76e3acca-b997-4839-bc46-6fa81f50ea3b",
                "name": "Rustic Concrete Chair",
                "price": "545.00",
                "count": 3
            },
            {
                "id": "7318e6c3-8520-4b2f-a77c-a53c659adec7",
                "name": "Luxurious Soft Keyboard",
                "price": "237.00",
                "count": 4
            },
            {
                "id": "5c276656-5b73-4a39-8a6b-6e191929ff80",
                "name": "Small Bronze Ball",
                "price": "106.00",
                "count": 1
            },
            {
                "id": "bf0c09a7-dfdc-4755-8e79-bb56725c94cf",
                "name": "Recycled Fresh Chicken",
                "price": "758.00",
                "count": 3
            }
        ],
        "total": 4963,
        "time": "2024-04-25T17:26:49.504Z"
    },
    {
        "user": "c12f95dd-9446-48bc-b124-9e0142d53820",
        "items": [
            {
                "id": "3a6d6722-4274-47d3-8b7f-f0a3ddbe4d14",
                "name": "Modern Soft Sausages",
                "price": "119.00",
                "count": 4
            },
            {
                "id": "ec3f05c4-20d5-496b-bc2f-97a4aa512f30",
                "name": "Refined Concrete Car",
                "price": "267.00",
                "count": 4
            },
            {
                "id": "df2ba433-b3bf-4ecf-8b0d-e5c847664ca3",
                "name": "Oriental Granite Chicken",
                "price": "998.00",
                "count": 1
            },
            {
                "id": "082ae09e-dac6-409f-98b1-b5ccb22d03d9",
                "name": "Intelligent Fresh Tuna",
                "price": "915.00",
                "count": 4
            },
            {
                "id": "bc2134da-814e-43c7-8306-a002c4e8913b",
                "name": "Recycled Soft Pants",
                "price": "482.00",
                "count": 3
            }
        ],
        "total": 7648,
        "time": "2023-08-25T09:07:45.495Z"
    },
    {
        "user": "c12f95dd-9446-48bc-b124-9e0142d53820",
        "items": [
            {
                "id": "d7fe8e4c-6aae-4385-bd33-23720762d097",
                "name": "Ergonomic Soft Shirt",
                "price": "471.00",
                "count": 4
            },
            {
                "id": "7a0a02b6-b653-487e-8999-f7fef102b86d",
                "name": "Recycled Granite Keyboard",
                "price": "26.00",
                "count": 2
            }
        ],
        "total": 1936,
        "time": "2023-11-26T09:06:26.996Z"
    }
]

```
