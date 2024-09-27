import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, SignupRequest, ApiResponse } from './auth.types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('customer/signup')
    customerSignUp(@Body() body: SignupRequest): Promise<ApiResponse> {
        return this.authService.customerSignup(body);
    }

    @Post('customer/login')
    customerLogin(@Body() body: LoginDto): Promise<ApiResponse> {
        return this.authService.customerLogin(body);
    }

    @Post('seller/signup')
    sellerSignUp(@Body() body: SignupRequest): Promise<ApiResponse> {
        return this.authService.sellerSignup(body);
    }

    @Post('seller/login')
    sellerLogin(@Body() body: LoginDto): Promise<ApiResponse> {
        return this.authService.sellerLogin(body);
    }

}
