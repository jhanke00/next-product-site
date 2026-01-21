import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders, OrdersDocument } from '../domain/orders.schema';
import { Users, UsersDocument } from '../domain/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private usersModel: Model<UsersDocument>,
    @InjectModel('Orders') private ordersModel: Model<OrdersDocument>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersModel.find().exec();
  }

  async findUserById(userId: string): Promise<Users> {
    const user = await this.usersModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return user;
  }

  async findUserOrders(userId: string): Promise<Orders[]> {
    return this.ordersModel
      .find({ user: userId })
      .populate({
        path: 'items.product',
        model: 'Products',
      })
      .exec();
  }

  async getUserTotalSpent(userId: string): Promise<Record<string, number>> {
    const orders = await this.ordersModel.find({ user: userId }).exec();
    return {
      totalSpent: orders.reduce((total, order) => total + order.total, 0),
    };
  }
}
