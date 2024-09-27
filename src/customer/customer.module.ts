import { Customer, CustomerSchema } from 'src/models/customer.schema';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CustomerAuthMiddleware } from '../auth/middleware.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
  ],
  providers: [CustomerService],
  controllers: [CustomerController]
})
export class CustomerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerAuthMiddleware)
      .forRoutes(CustomerController)
  }
}
