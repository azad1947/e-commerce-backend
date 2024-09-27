import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose from 'mongoose';

@Schema()
export class Product {
    @Prop({ required: true, ref: 'seller' })
    seller_id: mongoose.Types.ObjectId

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    qty: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export interface ProductDto {
    name: string;
    price: number;
    description: string;
    qty: number;
}

export interface UpdateProductDto {
    product_id: string;
    name?: string;
    price?: number;
    description?: string;
    qty?: number;
}