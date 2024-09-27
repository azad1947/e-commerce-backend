import { Controller, Get, Body, Post, Query, Param, Put, Delete, Req } from '@nestjs/common';
import { SellerService } from './seller.service';
import { ProductDto, UpdateProductDto } from 'src/models/product.schema';
import { ApiResponse } from 'src/auth/auth.types';

@Controller('api/seller/v1')
export class SellerController {
    constructor(
        private sellerService: SellerService
    ) { }

    @Get('get/seller')
    getSeller(@Query('seller_id') seller_id: string): Promise<ApiResponse> {
        return this.sellerService.getSeller(seller_id);
    }

    @Post('add/product')
    addProduct(@Body() body: ProductDto): Promise<ApiResponse> {
        return this.sellerService.addItem(body);
    }

    @Get('get/product/:id')
    getProduct(@Param('id') id: string): Promise<ApiResponse> {
        return this.sellerService.getItem(id);
    }

    @Get('get/products')
    getProducts(@Query() query: { pageNumber: number, seller_id: string }): Promise<ApiResponse> {
        return this.sellerService.getItems(query);
    }

    @Put('update/product')
    updateProduct(@Body() body: UpdateProductDto): Promise<ApiResponse> {
        return this.sellerService.updateItem(body);
    }

    @Delete('delete/product/:id')
    deleteProduct(@Param('id') id: string): Promise<ApiResponse> {
        return this.sellerService.deleteItem(id);
    }
}
