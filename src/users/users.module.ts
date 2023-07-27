import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DataSourceModule } from '../data-source/data-source.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    DataSourceModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([User], 'secondaryDB'),
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService],
  exports: [UsersService],
})
export class UsersModule {}
