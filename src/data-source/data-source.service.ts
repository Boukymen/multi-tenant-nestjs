import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import 'dotenv/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class DataSourceService {
  constructor(
    @Inject(REQUEST)
    private readonly requestContext: unknown,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    // console.log('Request Context: ', requestContext);
    // console.log('Data Source: ', dataSource);
  }

  async getDataSource(): Promise<DataSource> {
    const tenantId = (this.requestContext as any)?.tenantId;
    console.log('Tenant ID: ', tenantId);

    const existingSchema = await this.dataSource.manager.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name = 'tenant_${tenantId}'
      LIMIT 1;
    `);

    console.log('Existing schema: ', existingSchema);
    if (existingSchema.length === 0) {
      return new DataSource({
        type: 'postgres',
        host: this.configService.get('POSTGRES_HOST'),
        port: +this.configService.get<number>('POSTGRES_PORT'),
        username: this.configService.get('POSTGRES_USER'),
        password: this.configService.get('POSTGRES_PASSWORD'),
        database: this.configService.get('POSTGRES_DB'),
        synchronize: true,
        logging: false,
        schema: 'public',
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        subscribers: [],
      }).initialize();
    } else {
      return new DataSource({
        type: 'postgres',
        host: this.configService.get('POSTGRES_HOST'),
        port: +this.configService.get<number>('POSTGRES_PORT'),
        username: this.configService.get('POSTGRES_USER'),
        password: this.configService.get('POSTGRES_PASSWORD'),
        database: this.configService.get('POSTGRES_DB'),
        synchronize: true,
        logging: false,
        name: `tenant_${tenantId}`,
        schema: `tenant_${tenantId}`,
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        subscribers: [],
      }).initialize();
    }
  }

  getTenantId() {
    return (this.requestContext as any)?.tenantId;
  }
}
