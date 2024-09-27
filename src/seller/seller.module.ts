import { MiddlewareConsumer, Module } from '@nestjs/common';
import { Product, ProductSchema } from 'src/models/product.schema';
import { Seller, SellerSchema } from 'src/models/seller.schema';

import { MongooseModule } from '@nestjs/mongoose';
import { SellerAuthMiddleware } from 'src/auth/middleware.service';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Seller.name, schema: SellerSchema }]),
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
    ],
    controllers: [SellerController],
    providers: [SellerService]
})

export class SellerModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SellerAuthMiddleware)
            .forRoutes(SellerController)
    }
}
