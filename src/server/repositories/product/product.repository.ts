import { db } from '@/src/server/config/db';
import { productsTable } from '@/src/server/repositories/product/product.schema';
import { eq } from 'drizzle-orm';
import { ProductSelect } from '@/src/server/repositories/product/types';
import { pick } from '@utils/pick';

class ProductRepository {
  private readonly product = {
    id: productsTable.id,
    name: productsTable.name,
    price: productsTable.price,
    description: productsTable.description,
    category: productsTable.category,
    rating: productsTable.rating,
    numReviews: productsTable.numReviews,
    countInStock: productsTable.countInStock,
  };

  async findById(params: Pick<ProductSelect, 'id'> & { select?: Array<keyof ProductSelect> }) {
    const { select = [], id } = params;

    const product = await db.select(pick(this.product, select)).from(productsTable).where(eq(this.product.id, id));

    return product[0] ?? null;
  }
}

export const productRepository = new ProductRepository();
