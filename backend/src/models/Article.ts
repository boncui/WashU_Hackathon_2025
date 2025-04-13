// ✅ models/Article.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  name: string;
  summary: string;
  link: string;
  tags: string[];
  image: string;
}

const ArticleSchema: Schema<IArticle> = new Schema({
  name: { type: String, required: true },
  summary: { type: String, required: true },
  link: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String },
});

export default mongoose.model<IArticle>('Article', ArticleSchema);
