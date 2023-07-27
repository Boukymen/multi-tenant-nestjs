import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSourceModule } from './data-source/data-source.module';
import { UsersModule } from './users/users.module';
import { ContextIdFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregateByTenantContextIdStrategy } from './core/aggregate-by-tenant.strategy';
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantsModule } from './tenants/tenants.module';
import { ProductsModule } from './products/products.module';

ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());

@Module({
  imports: [
    DataSourceModule,
    // ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    EventEmitterModule.forRoot(),
    UsersModule,
    TenantsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
