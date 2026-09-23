import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

export interface OrderDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  // Server-computed total (Math.round to cents) — never the client's number.
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    size: { type: String },
    color: { type: String },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

orderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const source = ret.toObject ? ret.toObject() : ret;
    const { _id, __v, ...json } = source;
    void __v;
    return { id: String(_id), ...json };
  },
});

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
