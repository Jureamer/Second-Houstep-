import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { Customer } from './customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Customer]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'path/to/your/database.sqlite',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      dropSchema: true,
    }),
    CustomerModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
