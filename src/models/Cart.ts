import { populate } from 'dotenv';
import {model, Schema, Document,Types} from 'mongoose';
export interface ICart extends Document {
    userId: Types.ObjectId;
    products: {
        productId: Types.ObjectId;
        quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
const cartSchema = new Schema<ICart>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    products: [{   
        productId: { type: Schema.Types.ObjectId, ref: 'product',populate:true, required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
}, { timestamps: true }); 

export const Cart = model<ICart>('Cart', cartSchema);
