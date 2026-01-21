import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products, ProductsDocument } from '../domain/products.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private productModel: Model<ProductsDocument>,
  ) {}

  async findAllProducts(): Promise<Products[]> {
    return this.productModel.find().exec();
  }

  async findProductById(productId: string): Promise<Products> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }
    return product;
  }

  async searchProductsByName(query: string): Promise<Products[]> {
    return this.productModel
      .find({ name: { $regex: `^${query}`, $options: 'i' } })
      .exec();
  }
}
