import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';

import { CustomerService } from './customer.service';
import { ApiResponse } from 'src/auth/auth.types';

@Controller('api/c/v1')
export class CustomerController {
    constructor(private customerService: CustomerService) { }

    @Get('get/customer')
    getCustomer(@Query() query: { customer_id: string }): Promise<any> {
        return this.customerService.getCustomer(query.customer_id);
    }

    @Put('update/customer')
    updateCustomer(@Body() body: { name: string }): Promise<ApiResponse> {
        return this.customerService.updateCustomer(body);
    }
}
