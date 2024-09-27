import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Customer {
    @Prop({
        unique: true,
        required: true,
        validate: {
            validator: (email: string): boolean => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
            message: (props: { value: string }): string => `${props.value} is not a valid email!`
        },
    })
    email: string;

    @Prop({
        required: true,
        minlength: 4
    })
    name: string;

    @Prop({ required: true, minlength: 6 })
    password: string;

    @Prop({ default: Date.now() })
    createdAt: Date

    @Prop({ default: 'customer' })
    userType: string
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);