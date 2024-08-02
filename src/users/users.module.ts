// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
