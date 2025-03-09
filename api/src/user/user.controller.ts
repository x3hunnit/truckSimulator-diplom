import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data);
  }

  @Get()
  async findAll() {
    return this.userService.getAllUsers();
  }
}
