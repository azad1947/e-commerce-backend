import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from 'src/models/customer.schema';
import * as argon from 'argon2';
import { isEmpty } from 'lodash';
import { ApiResponse, LoginDto, SignupRequest } from './auth.types';
import { Seller } from 'src/models/seller.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
        @InjectModel(Seller.name) private readonly sellerModel: Model<Seller>,
        private jwtService: JwtService
    ) { }

    async customerSignup({ name, email, password }: SignupRequest): Promise<ApiResponse> {
        try {
            const customer = await this.customerModel.findOne({ email }).lean();

            if (!isEmpty(customer)) {
                return { result: null, status: 400, error: { status: 400, msg: 'email already exists.' } }
            }

            //INFO - applying this check separately here because after hashing password length will obviously become more than 6.
            if (!password || password.length < 6) {
                let msg: string = password ? (password.length < 6 ? 'password length must be of 6 character long.' : null) : 'password is required.'
                return { result: null, status: 400, error: { status: 400, msg: msg } };
            }

            const hash = await argon.hash(password);
            const doc = { name, email, password: hash };
            const new_doc = await this.customerModel.create(doc);
            const token = this.jwtService.sign({ email: new_doc.email, isLoggedIn: true, userType: new_doc.userType });
            return { result: { access_token: token }, status: 200, error: null };
        } catch (err) {
            console.log('err occurred while signing up the customer -->', err);
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

    async customerLogin(loginDto: LoginDto): Promise<ApiResponse> {
        try {
            const customer = await this.customerModel.findOne({ email: loginDto.email }).lean();

            if (isEmpty(customer)) {
                return {
                    result: null,
                    status: 400,
                    error: {
                        status: 400,
                        msg: 'no customer found with this mail.'
                    }
                }
            }

            const is_password_correct = await argon.verify(customer.password, loginDto.password);

            if (!is_password_correct) {
                return {
                    result: null,
                    status: 400,
                    error: {
                        status: 400,
                        msg: 'password is incorrect.'
                    }
                }
            }

            const token = this.jwtService.sign({ email: customer.email, isLoggedIn: true, userType: customer.userType });

            return {
                result: { access_token: token },
                status: 400,
                error: null
            };

        } catch (err) {
            console.log('error occurred while customer login --> ', err);
            return {
                result: null,
                status: err.status || 400,
                error: {
                    status: err.status || 400,
                    msg: err.message,
                    stack: err.stack,

                }
            }
        }
    }

    async sellerSignup({ name, email, password }: SignupRequest): Promise<ApiResponse> {
        try {
            const seller = await this.sellerModel.findOne({ email }).lean();

            if (!isEmpty(seller)) {
                return { result: null, status: 400, error: { status: 400, msg: 'email already exists.' } }
            }

            //INFO - applying this check separately here because after hashing password length will obviously become more than 6.
            if (!password || password.length < 6) {
                let msg: string = password ? (password.length < 6 ? 'password length must be of 6 character long.' : null) : 'password is required.'
                return { result: null, status: 400, error: { status: 400, msg: msg } };
            }

            const hash = await argon.hash(password);
            const doc = { name, email, password: hash };
            const new_doc = await this.sellerModel.create(doc);
            const token = this.jwtService.sign({ email: new_doc.email, isLoggedIn: true, userType: new_doc.userType });
            return { result: { access_token: token }, error: null, status: 200, };
        } catch (err) {
            console.log('err occurred while signing up the seller -->', err);
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

    async sellerLogin(loginDto: LoginDto): Promise<ApiResponse> {
        try {

            if (!loginDto.email || !loginDto.password) {
                let msg: string = loginDto.email ? (loginDto.password ? null : 'password') : 'email';
                return {
                    result: null,
                    status: 400,
                    error: {
                        status: 400,
                        msg: msg + ' is required.'
                    }
                }
            }

            const seller = await this.sellerModel.findOne({ email: loginDto.email }).lean();

            if (isEmpty(seller)) {
                return {
                    result: null,
                    status: 400,
                    error: {
                        status: 400,
                        msg: 'no customer found with this mail.'
                    }
                }
            }

            const is_password_correct = await argon.verify(seller.password, loginDto.password);

            if (!is_password_correct) {
                return {
                    result: null,
                    status: 400,
                    error: {
                        status: 400,
                        msg: 'password is incorrect.'
                    }
                }
            }

            const token = this.jwtService.sign({ email: seller.email, isLoggedIn: true, userType: seller.userType });
            return { result: { access_token: token }, error: null, status: 200, };

        } catch (err) {
            console.log('error occurred while seller login --> ', err);
            return {
                result: null,
                status: err.status || 400,
                error: {
                    status: err.status || 400,
                    msg: err.message,
                    stack: err.stack,

                }
            }
        }
    }

}
