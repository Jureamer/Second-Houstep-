import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Customer } from './customer/entities/customer.entity';
import { Order } from './order/entities/order.entity';
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly customerColumnInfo = ['고객 id', '고객명', '고객등급'];
  private readonly orderColumnInfo = [
    '주문고객 id',
    '주문일자',
    '주문타입',
    '주문금액',
  ];
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async processFile(file): Promise<any> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });

      const customersData = XLSX.utils.sheet_to_json(
        workbook.Sheets['customer'],
      );
      const ordersData = XLSX.utils.sheet_to_json(workbook.Sheets['order']);

      await this.saveCustomers(customersData);
      await this.saveOrders(ordersData);
    } catch (error) {
      this.logger.error('파일 처리 중 에러가 발생했습니다.', error.stack);
      throw error;
    }
  }

  private async saveCustomers(customersData: any[]): Promise<void> {
    for (const data of customersData) {
      const customer = new Customer();
      customer.id = data[this.customerColumnInfo[0]];
      customer.name = data[this.customerColumnInfo[1]];
      customer.grade = data[this.customerColumnInfo[2]];

      await this.customerRepository.save(customer);
    }
  }

  private async saveOrders(ordersData: any[]): Promise<void> {
    for (const data of ordersData) {
      const order = new Order();

      order.customerId = data[this.orderColumnInfo[0]];
      order.orderDate = new Date(
        this.excelSerialDateToJSDate(data[this.orderColumnInfo[1]]),
      );
      order.orderType = data[this.orderColumnInfo[2]];
      order.orderAmount = data[this.orderColumnInfo[3]];

      await this.orderRepository.save(order);
    }
  }

  private excelSerialDateToJSDate(excelSerialDate) {
    const daysBeforeUnixEpoch = 70 * 365 + 19;
    const hour = 60 * 60 * 1000;
    return new Date(
      Math.round((excelSerialDate - daysBeforeUnixEpoch) * 24 * hour) +
        12 * hour,
    );
  }
}
