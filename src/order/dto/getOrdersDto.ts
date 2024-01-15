import { IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class GetOrdersDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  orderType?: number; // 0 for order, 1 for return

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize?: number = 50;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageNo?: number = 1;
}
