import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiResponse } from 'src/auth/auth.types';
import { Product, ProductDto, UpdateProductDto } from 'src/models/product.schema';
import { Seller } from 'src/models/seller.schema';

@Injectable()
export class SellerService {
    constructor(
        @InjectModel(Seller.name) private readonly sellerModel: Model<Seller>,
        @InjectModel(Product.name) private readonly productModel: Model<Product>
    ) { }

    async getSeller(id: string): Promise<ApiResponse> {
        try {
            if (!id) {
                return {
                    result: null,
                    status: 400,
                    error: {
                        status: 400,
                        msg: 'seller_id is required.'
                    }
                }
            }

            const seller = await this.sellerModel.findOne({ _id: id }, { password: 0 }).lean();
            return { result: seller, status: 200, error: null };
        } catch (err) {
            console.log('err occurred while fetching the seller -->', err);
            return {
                result: null,
                status: err.status || 400,
                error: {
                    status: err.status || 400,
                    msg: err.message || 'something went wrong.',
                    stack: err.stack
                }
            }
        }
    }

    async addItem(productDto: ProductDto): Promise<ApiResponse> {
        try {
            const product = await this.productModel.create(productDto);
            return { result: product, status: 200, error: null };
        } catch (err) {
            console.log('err occurred while fetching the seller -->', err);
            return {
                result: null,
                status: err.status || 400,
                error: {
                    status: err.status || 400,
                    msg: err.message || 'something went wrong.',
                    stack: err.stack
                }
            }
        }
    }

    async getItem(product_id: string): Promise<ApiResponse> {
        try {
            const product = await this.productModel.findOne({ _id: product_id }, { seller_id: 0 }).lean();
            return {
                result: product,
                status: 200,
                error: null
            }
        } catch (err) {
            console.log('err occurred while fetching the product -->', err);
            return {
                result: null,
                status: err.status || 400,
                error: {
                    status: err.status || 400,
                    msg: err.message || 'something went wrong.',
                    stack: err.stack
                }
            }
        }
    }

    async getItems(obj: { pageNumber: number, seller_id: string }): Promise<ApiResponse> {
        try {
            console.log('query-->', obj)
            const limit = 10;
            let page = obj.pageNumber > 0 ? obj.pageNumber : 1;

            const products = await this.productModel
                .find({ seller_id: obj.seller_id }, { seller_id: 0 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();

            const total = await this.productModel.countDocuments({ seller_id: obj.seller_id });

            return {
                result: { products, total },
                status: 200,
                error: null
            }
        } catch (err) {
            console.log('err occurred while fetching the product -->', err);
            return {
                result: null,
                status: err.status || 400,
                error: {
                    status: err.status || 400,
                    msg: err.message || 'something went wrong.',
                    stack: err.stack
                }
            }
        }
    }

    async updateItem(productDto: UpdateProductDto): Promise<ApiResponse> {
        try {
            const filter = { _id: productDto.product_id };
            const update: any = {};

            if (productDto.name) {
                update.name = productDto.name;
            }

            if (productDto.price) {
                update.price = productDto.price;
            }

            if (productDto.description) {
                update.description = productDto.description;
            }

            if (productDto.qty) {
                update.qty = productDto.qty;
            }

            const product = await this.productModel.findOneAndUpdate(filter, { $set: update }, { new: true }).lean();

            return {
                result: product,
                status: 200,
                error: null
            }
        } catch (err) {
            console.log('err occurred while fetching the product -->', err);
            return {
                result: null,
                status: err.status || 400,
                error: {
                    status: err.status || 400,
                    msg: err.message || 'something went wrong.',
                    stack: err.stack
                }
            }
        }
    }

    async deleteItem(product_id: string): Promise<ApiResponse> {
        try {

            await this.productModel.deleteOne({ _id: product_id }).lean();
            return {
                result: { msg: 'product has been deleted.' },
                status: 200,
                error: null
            }
        } catch (err) {
            console.log('err occurred while deleting the product -->', err);
            return {
                result: null,
                status: err.status || 400,
                error: {
                    status: err.status || 400,
                    msg: err.message || 'something went wrong.',
                    stack: err.stack
                }
            }
        }
    }
}
