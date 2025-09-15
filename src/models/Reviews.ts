import {Schema,model,Document,Types} from 'mongoose';
export interface IReview extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
const reviewSchema = new Schema<IReview>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
}, { timestamps: true });
export const Review = model<IReview>('Review', reviewSchema);