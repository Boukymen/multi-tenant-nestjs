import 'reflect-metadata';
import 'dotenv/config';
import { Module } from '@nestjs/common';
import { DataSourceService } from './data-source.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    //connection to Postgres
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
        // dataSourceService: DataSourceService,
        // dataSource: DataSource,
      ): any => {
        // const tenantId = dataSourceService?.getTenantId();
        // if (tenantId) {
        //   const existingSchema = dataSource?.manager?.query(`
        //     SELECT schema_name
        //     FROM information_schema.schemata
        //     WHERE schema_name = 'tenant_${tenantId}'
        //     LIMIT 1;
        //   `);
        //   console.log('Existing schema: ', existingSchema);
        // }
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: +configService.get<number>('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: [...[__dirname + '/**/*.entity.{js,ts}']],
          synchronize: true,
          autoLoadEntities: true,
          logging: false,
        };
      },
    }),
    // SECONDARY DB CONNECTION
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'secondaryDB',
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB_S'),
          entities: [...[__dirname + '/**/*.entity.{js,ts}']],
          synchronize: true,
          autoLoadEntities: true,
          logging: false,
        };
      },
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [DataSourceService],
  exports: [DataSourceService],
})
export class DataSourceModule {}

// export const mongooseProviders = [
//   {
//     provide: 'TENANT_CONNECTION',
//     scope: Scope.REQUEST,
//     useFactory: async (connection: DataSourceService): Promise<unknown> => {
//        return await connection.getConnection();
//     },
//     inject: [DataSourceService],
//   },
// ];
