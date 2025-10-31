import { createYoga, createSchema } from 'graphql-yoga';
import { NextResponse } from 'next/server';
import { getProducts, getAllProducts } from '@/src/utils/products';
import {
  addReview,
  listReviews,
  voteHelpful,
  moderateReview,
  subscribe as subscribeReviews,
} from '@/src/utils/reviews';

export const dynamic = 'force-dynamic';

const typeDefs = /* GraphQL */ `
  enum ReviewStatus {
    PENDING
    APPROVED
    REJECTED
  }

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

  type ReviewCreated {
    review: Review!
  }

  type ReviewHelpful {
    reviewId: ID!
    helpfulCount: Int!
  }

  type ReviewModerated {
    reviewId: ID!
    status: ReviewStatus!
  }

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

  type Subscription {
    reviewEvents(productId: ID!): ReviewEvent!
  }
`;

function toStatusString(s?: string) {
  if (!s) return undefined;
  const m = s.toLowerCase();
  if (m === 'approved' || m === 'pending' || m === 'rejected') return m as any;
  return undefined;
}

function makeReviewEventIterable(productId: string): AsyncIterable<any> {
  return (async function* () {
    const buffer: any[] = [];
    let pendingResolve: ((value: any) => void) | null = null;
    const unsubscribe = subscribeReviews(productId, (evt) => {
      let payload: any;
      if (evt.type === 'created') {
        payload = { __typename: 'ReviewCreated', review: evt.payload };
      } else if (evt.type === 'helpful') {
        payload = { __typename: 'ReviewHelpful', reviewId: evt.payload.id, helpfulCount: evt.payload.helpfulCount };
      } else if (evt.type === 'moderated') {
        payload = {
          __typename: 'ReviewModerated',
          reviewId: evt.payload.id,
          status: (evt.payload.status || 'approved').toUpperCase(),
        };
      }
      if (!payload) return;
      if (pendingResolve) {
        const r = pendingResolve;
        pendingResolve = null;
        r(payload);
      } else {
        buffer.push(payload);
      }
    });
    try {
      while (true) {
        if (buffer.length) {
          yield buffer.shift();
        } else {
          const value = await new Promise<any>((res) => {
            pendingResolve = res;
          });
          yield value;
        }
      }
    } finally {
      unsubscribe();
    }
  })();
}

const resolvers = {
  ReviewEvent: {
    __resolveType(obj: any) {
      return obj.__typename || null;
    },
  },
  Review: {
    status(obj: any) {
      const s = obj.status || 'approved';
      return String(s).toUpperCase();
    },
  },
  Query: {
    async products(_root: any, args: any) {
      const { page = 1, pageSize = 20, search = '', category = '' } = args || {};
      return await getProducts({ page, pageSize, search, category });
    },
    product(_root: any, args: any) {
      const { id } = args;
      const all = getAllProducts();
      return all.find((p) => String((p as any).id) === String(id)) || null;
    },
    async reviews(_root: any, args: any) {
      const { productId, sort = 'newest', minRating = 0, status } = args || {};
      const result = await listReviews(String(productId), {
        sort,
        minRating: Number(minRating) || 0,
        status: toStatusString(status) as any,
      });
      return result.data;
    },
  },
  Mutation: {
    async createReview(_root: any, args: any, ctx: any) {
      const userId = ctx.userId;
      if (!userId) {
        throw new Error('Unauthorized');
      }
      const { productId, rating, title, content } = args;
      return await addReview(userId, { productId: String(productId), rating: Number(rating), title, content });
    },
    async voteHelpful(_root: any, args: any) {
      const { reviewId } = args;
      const updated = await voteHelpful(String(reviewId));
      if (!updated) throw new Error('Not Found');
      return updated;
    },
    async moderateReview(_root: any, args: any, ctx: any) {
      if (!ctx.isAdmin) throw new Error('Forbidden');
      const { reviewId, status } = args;
      const updated = await moderateReview(String(reviewId), toStatusString(status) as any);
      if (!updated) throw new Error('Not Found');
      return updated;
    },
  },
  Subscription: {
    reviewEvents: {
      subscribe(_root: any, args: any) {
        const { productId } = args;
        return makeReviewEventIterable(String(productId));
      },
      resolve(payload: any) {
        return payload;
      },
    },
  },
};

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-user-id', 'x-admin'],
  },
  // Surface headers to resolvers via context
  context({ request }) {
    const userId = request.headers.get('x-user-id');
    const isAdmin = request.headers.get('x-admin') === 'true';
    return { userId, isAdmin };
  },
});

export { yoga as GET, yoga as POST, yoga as OPTIONS };
