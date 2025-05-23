// ✅ backend/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import './Interests';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  interests: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[]; // mutual followers
  followers: mongoose.Types.ObjectId[]; // 👈 Add this line
}

const UserSchema: Schema<IUser> = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest', default: [] }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // 👈 Add this line
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);