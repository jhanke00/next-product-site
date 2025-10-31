# GraphQL Endpoint

The GraphQL API is available at `/api/graphql` and mirrors the existing REST endpoints for products and reviews. It includes queries, mutations, and a subscription for real‑time review events.

## Endpoint

- URL: `/api/graphql`
- Methods: `GET`, `POST`, `OPTIONS`
- CORS: `*` (headers: `Content-Type`, `Authorization`, `X-Requested-With`, `x-user-id`, `x-admin`)
- Auth:
  - `x-user-id`: required for `createReview`
  - `x-admin: true`: required for `moderateReview`

## Schema

```
enum ReviewStatus { PENDING APPROVED REJECTED }

type Product {
  id: ID!
  name: String!
  description: String
  price: Float
  category: String
  rating: Float
  numReviews: Int
  countInStock: Int
  image: String
}

type ProductsResult {
  data: [Product!]!
  page: Int!
  pageSize: Int!
  total: Int!
  totalPages: Int!
  search: String!
  category: String!
  categories: [String!]!
}

type Review {
  id: ID!
  productId: ID!
  userId: ID!
  rating: Int!
  title: String
  content: String!
  helpfulCount: Int!
  createdAt: String!
  status: ReviewStatus!
}

type ReviewCreated { review: Review! }
type ReviewHelpful { reviewId: ID!, helpfulCount: Int! }
type ReviewModerated { reviewId: ID!, status: ReviewStatus! }
union ReviewEvent = ReviewCreated | ReviewHelpful | ReviewModerated

type Query {
  products(page: Int, pageSize: Int, search: String, category: String): ProductsResult!
  product(id: ID!): Product
  reviews(productId: ID!, sort: String, minRating: Int, status: ReviewStatus): [Review!]!
}

type Mutation {
  createReview(productId: ID!, rating: Int!, title: String, content: String!): Review!
  voteHelpful(reviewId: ID!): Review!
  moderateReview(reviewId: ID!, status: ReviewStatus!): Review!
}

type Subscription { reviewEvents(productId: ID!): ReviewEvent! }
```

## Examples

### Query products

```
query {
  products(page: 1, pageSize: 3) {
    total
    data { id name rating numReviews }
  }
}
```

### Query reviews for a product

```
query {
  reviews(productId: "1") {
    id
    rating
    content
    status
    helpfulCount
  }
}
```

### Create a review (requires `x-user-id`)

Headers:

```
x-user-id: u-1
```

Mutation:

```
mutation {
  createReview(productId: "1", rating: 5, title: "GraphQL", content: "GraphQL test review") {
    id
    rating
    content
    status
    helpfulCount
  }
}
```

### Vote helpful

```
mutation { voteHelpful(reviewId: "<reviewId>") { id helpfulCount } }
```

### Moderate a review (requires `x-admin: true`)

Headers:

```
x-admin: true
```

Mutation:

```
mutation { moderateReview(reviewId: "<reviewId>", status: REJECTED) { id status } }
```

### Subscribe to review events

```
subscription { reviewEvents(productId: "1") { __typename ... on ReviewCreated { review { id rating status } } ... on ReviewHelpful { reviewId helpfulCount } ... on ReviewModerated { reviewId status } } }
```

## Playground

- Navigate to `/graphql` for a simple embedded GraphiQL pointing at `/api/graphql`.
- Or visit `/api/graphql` directly in a browser, which serves GraphiQL.
