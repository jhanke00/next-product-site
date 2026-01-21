import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../controller/users.controller';
import { OrdersSchema } from '../domain/orders.schema';
import { ProductsSchema } from '../domain/products.schema';
import { UsersSchema } from '../domain/users.schema';
import { UsersService } from '../service/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Orders', schema: OrdersSchema }]),
    MongooseModule.forFeature([{ name: 'Products', schema: ProductsSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
