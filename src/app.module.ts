import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1/nestjs-ecommerce'), AuthModule, CustomerModule, SellerModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
