import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.usersService.findUserById(userId);
  }

  @Get(':userId/orders')
  async getUserOrders(@Param('userId') userId: string) {
    return this.usersService.findUserOrders(userId);
  }

  @Get(':userId/total-spent')
  async getUserTotalSpent(@Param('userId') userId: string) {
    return this.usersService.getUserTotalSpent(userId);
  }
}
