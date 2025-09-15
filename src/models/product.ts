import {Schema, model, Document,Types} from 'mongoose';
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    discountedPrice: number;
    stock: number;
    category: string;
    images: string[];
    ratings: [{
        averageRating: number;
        numberOfRatings: number;
    }]
    user:Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    ratings: [{
        averageRating: { type: Number, default: 0 },
        numberOfRatings: { type: Number, default: 0 },
    }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const Product = model<IProduct>('product', productSchema);