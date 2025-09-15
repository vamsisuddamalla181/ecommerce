import {Schema,model,Document,Types} from 'mongoose';
export interface IOrder extends Document {
    userId: Types.ObjectId;
    products: [{
        productId: Types.ObjectId;
        quantity: number;
        price: number;
    }];
    totalAmount: number;
    orderStatus: string;    
    paymentStatus: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        pincode: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
const orderSchema = new Schema<IOrder>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{        
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: Number, required: true },
    },
}, { timestamps: true });
export const Order = model<IOrder>('Order', orderSchema);