import mongoose, { Document, Schema} from "mongoose";

interface MenCollection extends Document {
    image: string;
    productName: string;
    price: number;
    info: string;
    category: string;
}

const menclothesSchema: Schema = new Schema({
    image: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => /^https?:\/\/.+/.test(v),
            message: 'Must be a valid URL'
        }
    },
    productName: {type: String, required: true},
    price: {type: Number},
    info: {type: String},
    category: {type: String}
})

export const menclothesModel = mongoose.model<MenCollection>('menclothes', menclothesSchema)