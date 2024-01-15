import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
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
