// ✅ models/Interest.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IArticle } from './Article';

export enum InterestType {
  Type1 = 'Type1',
  Type2 = 'Type2',
}

export interface IInterest extends Document {
  name: string;
  type: InterestType;
  update: boolean;
  articles: IArticle[];
}

const InterestSchema: Schema<IInterest> = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(InterestType), required: true },
  update: { type: Boolean, required: true },
  articles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Article',
    validate: [
      (arr: mongoose.Types.ObjectId[]) => arr.length <= 5,
      'An interest can only have up to 5 articles',
    ],
  },
});

export default mongoose.model<IInterest>('Interest', InterestSchema);