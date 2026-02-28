import mongoose, {Document, Schema} from "mongoose";

interface WomenCollection extends Document {
    image: string;
    productName: string;
    price: number;
    info: string;
    category: string;
}

const WomenClothesSchema : Schema = new Schema({
    image: String,
    productName: String,
    price: Number,
    info: String,
    category: String,
})

export const womenClothesModel = mongoose.model<WomenCollection>('Womenclothes', WomenClothesSchema);