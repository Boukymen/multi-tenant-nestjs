import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSourceService } from '../data-source/data-source.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant1Product } from './entities/tenant1product.entity';
import { Tenant2Product } from './entities/tenant2product.entity';

@Injectable()
export class ProductsService {
  private readonly tenantId;
  private readonly selectedRepository;
  constructor(
    private readonly dataSourceService: DataSourceService,
    @InjectRepository(Tenant1Product)
    private readonly tenant1ProductRepository: Repository<Tenant1Product>,
    @InjectRepository(Tenant2Product, 'secondaryDB')
    private readonly tenant2ProductRepository: Repository<Tenant2Product>,
  ) {
    this.tenantId = this.dataSourceService.getTenantId();
    this.selectedRepository =
      this.tenantId === '2'
        ? this.tenant2ProductRepository
        : this.tenant1ProductRepository;
    console.log('tenantId', this.tenantId);
  }
  async create(createProductDto: CreateProductDto) {
    return await this.selectedRepository.save(createProductDto);
  }

  async findAll() {
    return await this.selectedRepository.find();
  }

  async findOne(id: number) {
    return await this.selectedRepository.findOne({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.selectedRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    return await this.selectedRepository.delete(id);
  }
}
