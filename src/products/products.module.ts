import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant1Product } from './entities/tenant1product.entity';
import { Tenant2Product } from './entities/tenant2product.entity';
import { DataSourceModule } from '../data-source/data-source.module';

@Module({
  imports: [
    DataSourceModule,
    TypeOrmModule.forFeature([Tenant1Product]),
    TypeOrmModule.forFeature([Tenant2Product], 'secondaryDB'),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
