import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from '../controller/products.controller';
import { ProductsSchema } from '../domain/products.schema';
import { ProductsService } from '../service/products.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Products', schema: ProductsSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
