import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'customer';

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ['admin', 'customer'], default: 'customer' },
  },
  { timestamps: true, versionKey: false },
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id, password, ...json } = ret.toObject ? ret.toObject() : ret;
    void _id;
    void password;
    return json;
  },
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
