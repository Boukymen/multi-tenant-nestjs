import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  Price: number;

  @ApiProperty()
  Quantity: number;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  supplierName: string;

  @ApiProperty()
  inventoryId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
