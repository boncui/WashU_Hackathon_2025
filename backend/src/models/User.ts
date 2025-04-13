import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  interests: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
});

export default mongoose.model<IUser>('User', UserSchema);
