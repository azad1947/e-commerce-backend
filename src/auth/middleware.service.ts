import * as jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from 'src/models/customer.schema';
import { Seller } from 'src/models/seller.schema';
import { Model } from 'mongoose';
import { Injectable, NestMiddleware } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class CustomerAuthMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorization } = req.headers;
            const token = authorization.split(' ')[1];
            console.log('process.env.JWT_SECRET', process.env.JWT_SECRET)
            const decode: any = jwt.verify(token, process.env.JWT_SECRET);

            if (decode.userType !== 'customer') {
                return res.sendStatus(401);
            }

            const currentTime = Math.floor(Date.now() / 1000);

            if (decode?.isLoggedIn && decode?.exp > currentTime) {
                const customer = await this.customerModel.findOne({ email: decode.email }).lean();
                if (req.method === 'GET') {
                    req.query.customer_id = customer._id.toString();
                } else {
                    req.body.customer_id = customer._id.toString();
                }
                next();
            } else {
                res.sendStatus(401);
            }

        } catch (err) {
            console.log('err occurred in the customer middleware ', err.message)
            res.sendStatus(401);
        }
    }
}

@Injectable()
export class SellerAuthMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(Seller.name) private readonly sellerModel: Model<Seller>,
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorization } = req.headers;
            const token = authorization.split(' ')[1];
            const decode: any = jwt.verify(token, process.env.JWT_SECRET);

            if (decode.userType !== 'seller') {
                return res.sendStatus(401);
            }

            const currentTime = Math.floor(Date.now() / 1000);

            if (decode?.isLoggedIn && decode?.exp > currentTime) {
                const seller = await this.sellerModel.findOne({ email: decode.email }).lean();
                if (req.method === 'GET') {
                    req.query.seller_id = seller._id.toString();
                } else {
                    req.body.seller_id = seller._id.toString();
                }
                next();
            } else {
                res.sendStatus(401);
            }

        } catch (err) {
            console.log('err occurred in the seller middleware ', err.message)
            res.sendStatus(401);
        }
    }
}
