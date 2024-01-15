import { Customer } from 'src/customer/entities/customer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, { eager: false })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  orderDate: Date;

  @Column()
  orderType: string;

  @Column()
  orderAmount: number;
}
