import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiResponse } from 'src/auth/auth.types';
import { Customer } from 'src/models/customer.schema';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    ) { }

    async getCustomer(id: string): Promise<ApiResponse> {
        try {
            if (!id) {
                return {
                    result: null,
                    status: 400,
                    error: {
                        status: 400,
                        msg: 'customer_id is required.'
                    }
                }
            }

            const customer = await this.customerModel.findOne({ _id: id }, { password: 0 }).lean();
            return { result: customer, status: 200, error: null };
        } catch (err) {
            console.log('err occurred while fetching the customer -->', err);
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

    async updateCustomer(body: { customer_id?: string, name: string }): Promise<ApiResponse> {
        try {
            const { customer_id, name } = body;
            const filter = { _id: customer_id };

            let update: { name?: string } = {};
            // we can update more fields but
            //  for demonstration purpose 
            // i just added name to update
            if (name) {
                update.name = name;
            }

            const customer = await this.customerModel.findOneAndUpdate(filter, { $set: update }, { new: true }).lean();
            return { result: customer, status: 200, error: null };
        } catch (err) {
            console.log('err occurred while updating the customer -->', err);
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
