import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository, DataSource } from 'typeorm';
import { DataSourceService } from '../data-source/data-source.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly dataSourceService: DataSourceService,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    let tenant = new Tenant();
    tenant.name = createTenantDto.name;
    tenant = await this.tenantRepository.save(tenant);
    const schemaName = `tenant_${tenant.id}`;

    await this.dataSource.manager.query(
      `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
    );
  }

  async findAll() {
    return await this.tenantRepository.find();
  }

  async findOne(id: number) {
    return await this.tenantRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    tenant.name = updateTenantDto.name;
    return await this.tenantRepository.save(tenant);
  }

  async remove(id: number) {
    return await this.tenantRepository.delete({ id });
  }
}
