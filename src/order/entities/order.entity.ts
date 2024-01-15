import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  customerId: number;

  @Column()
  orderDate: Date;

  @Column()
  orderType: string;

  @Column()
  orderAmount: number;
}
