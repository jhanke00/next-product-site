import { Product, IProductModel } from '@/src/type/products';
import HttpStatusCode from '@/src/utils/HttpStatusCode';
import largeProductsData from '@mock/large/products.json';
import smallProductsData from '@mock/small/products.json';
import { ApiError } from 'next/dist/server/api-utils';

const datasets: { [key: string]: Product[] } = { small: smallProductsData, large: largeProductsData };

export default class MockModel implements IProductModel {
  private mockData: Product[];
  private static instances: { [key: string]: MockModel } = {};

  public static getInstance(dataset: string): MockModel {
    if (!MockModel.instances[dataset]) {
      const productDataset = datasets[dataset];
      if (!productDataset) throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Invalid dataset');
      MockModel.instances[dataset] = new MockModel(productDataset);
    }
    return MockModel.instances[dataset];
  }

  constructor(mockData: Product[]) {
    this.mockData = mockData;
  }
  async getCount(): Promise<number> {
    return this.mockData.length;
  }
  async getPaginatedProducts(
    page: number,
    productsPerPage: number,
    query: string,
    category: string
  ): Promise<Product[]> {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    let filteredProducts = this.mockData;

    if (query) {
      filteredProducts = filteredProducts.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
    }

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return paginatedProducts;
  }
  async getAll(): Promise<Product[]> {
    return this.mockData;
  }
  async getById(id: string): Promise<Product> {
    const product = this.mockData.find((product) => product.id === id);
    if (!product) throw new ApiError(HttpStatusCode.NOT_FOUND, 'Product not found');
    return product;
  }
  async create(data: Product): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  async update(id: string, data: Product): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<Product> {
    throw new Error('Method not implemented.');
  }
}
