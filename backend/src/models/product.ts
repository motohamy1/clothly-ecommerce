import mongoose, { Document, Schema } from 'mongoose';

export type ProductSection = 'men' | 'women' | 'kids';
export type ProductCategory = 'clothing' | 'shoe';
export type ProductGroup = 'clothing' | 'outerwear' | 'shoes';

export interface ProductVariant {
  colorName: string;
  colorValue: string;
  image?: string;
}

export interface ProductDocument extends Document {
  id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  group: ProductGroup;
  section: ProductSection;
  description: string;
  images: string[];
  sizes: string[];
  variants: ProductVariant[];
}

const productVariantSchema = new Schema<ProductVariant>(
  {
    colorName: { type: String, required: true },
    colorValue: { type: String, required: true },
    image: { type: String },
  },
  { _id: false },
);

const productSchema = new Schema<ProductDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true, enum: ['clothing', 'shoe'] },
    group: { type: String, required: true, enum: ['clothing', 'outerwear', 'shoes'] },
    section: { type: String, required: true, enum: ['men', 'women', 'kids'], index: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    variants: { type: [productVariantSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id, ...json } = ret.toObject ? ret.toObject() : ret;
    void _id;
    return json;
  },
});

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
