import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetOrdersDto } from './dto/getOrdersDto';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders(@Query() query: GetOrdersDto): Promise<Order[]> {
    return await this.orderService.getOrders(query);
  }

  @Get('monthly-sales')
  getMonthlySales() {
    return this.orderService.getMonthlySales();
  }
}
