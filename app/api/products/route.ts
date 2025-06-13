import { createYoga, createSchema } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import rawProducts from '@/src/mock/small/products.json';
import { Product } from '@/src/type/products';

const products = rawProducts as Product[];

const typeDefs = `
  type Product {
    id: String
    name: String
    price: String
    description: String
    category: String
    rating: Float
    numReviews: Int
    countInStock: Int
  }

  type Query {
    products(name: String, category: String): [Product!]!
  }
`;

const resolvers = {
  Query: {
    products: (_: unknown, args: { name?: string | null; category?: string | null }) => {
      let result = products;

      const name = args.name?.trim() ?? '';
      const category = args.category?.trim() ?? '';

      if (args.name !== undefined && (name === '' || name.length < 5)) {
        throw new Error('The "name" parameter must be at least 5 characters long and not empty.');
      }

      if (name) {
        result = result.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
      }

      if (category) {
        result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      return result;
    },
  },
};

const yoga = createYoga<{ req: NextRequest }>({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/api/products',
});

export { yoga as GET, yoga as POST };
