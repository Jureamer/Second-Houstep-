import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { GetOrdersDto } from './dto/getOrdersDto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getOrders(query: GetOrdersDto): Promise<Order[]> {
    const where: FindOptionsWhere<Order> = {};
    const pageSize = query.pageSize || 50;
    const pageNo = query.pageNo || 1;
    const skipAmount: number = (pageNo - 1) * pageSize;

    console.log(`query: ${JSON.stringify(query)}`);

    if (query.startDate !== undefined && query.endDate !== undefined) {
      console.log('일자 검색 조건이 있습니다.');
      where.orderDate = Between(
        new Date(query.startDate),
        new Date(query.endDate),
      );
    }

    if (query.orderType !== undefined) {
      console.log('주문/반품 검색 조건이 있습니다.');
      where.orderType = query.orderType === 0 ? 'order' : 'refund';
    }

    if (query.customerId !== undefined) {
      console.log('고객 검색 조건이 있습니다.');
      where.customerId = query.customerId;
    }

    return this.orderRepository.find({
      where,
      relations: ['customer'],
      order: {
        orderDate: 'DESC',
      },
      take: query.pageSize,
      skip: skipAmount,
    });
  }

  async getMonthlySales(): Promise<any> {
    const statistics = [];
    for (let year = 2023; year <= 2024; year++) {
      for (let month = 1; month <= 12; month++) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        const orders = await this.orderRepository.find({
          where: {
            orderDate: Between(startDate, endDate),
          },
        });

        // 주문이 없는 달은 통계에 포함하지 않는다.
        if (orders.length === 0) {
          continue;
        }

        const monthlyStats = orders.reduce(
          (acc, order) => {
            if (order.orderType === 'order') {
              acc.orderAmount += order.orderAmount;
            } else if (order.orderType === 'refund') {
              acc.refundAmount += order.orderAmount;
            }
            return acc;
          },
          { orderAmount: 0, refundAmount: 0, sales: 0 },
        );

        monthlyStats.sales =
          monthlyStats.orderAmount - monthlyStats.refundAmount;

        const statisticsDate = `${year}년 ${month}월`;
        statistics.push({
          date: statisticsDate,
          orderAmount: monthlyStats.orderAmount.toLocaleString() + '원',
          refundAmount: monthlyStats.refundAmount.toLocaleString() + '원',
          sales: monthlyStats.sales.toLocaleString() + '원',
        });
      }
    }

    return statistics;
  }
}
