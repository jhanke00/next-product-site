import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../service/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Get('search')
  async searchProducts(@Query('name') name: string) {
    return this.productsService.searchProductsByName(name);
  }

  @Get(':productId')
  async getProductById(@Param('productId') productId: string) {
    return this.productsService.findProductById(productId);
  }
}
