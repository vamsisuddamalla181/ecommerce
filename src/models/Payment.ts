import {Schema,Document,model,Types} from 'mongoose';
export interface IPayment extends Document {
    orderId: Types.ObjectId;
    paymentMethod: string;
    trasactionId: string;
    amount: number;
    status: string;
    createdAt: Date;
}
const paymentSchema = new Schema<IPayment>({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    paymentMethod: { type: String, required: true },
    trasactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Payment = model<IPayment>('Payment', paymentSchema);