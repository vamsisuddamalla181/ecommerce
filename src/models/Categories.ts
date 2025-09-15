import {Schema, model,Document,Types} from 'mongoose';
export interface ICategory extends Document {
    name:String;
    description:String;
}
const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
}); 
export const Category = model<ICategory>('Category', categorySchema);