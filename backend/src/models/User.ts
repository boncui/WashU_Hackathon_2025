// ✅ Updated User Model: models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISpotifySong {
  id: string;
  name: string;
  artists: string[];
  uri: string;
  externalUrl: string;
  image: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role?: string;
  createdEvents: mongoose.Types.ObjectId[];
  joinedEvents: mongoose.Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  spotifySongs?: ISpotifySong[];
  spotifyConnected?: boolean;
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "User" },
  createdEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  joinedEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  spotifyConnected: { type: Boolean, default: false },
  spotifySongs: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    artists: [{ type: String, required: true }],
    uri: { type: String, required: true },
    externalUrl: { type: String, required: true },
    image: { type: String, required: true }
  }]
});

export default mongoose.model<IUser>('User', UserSchema);