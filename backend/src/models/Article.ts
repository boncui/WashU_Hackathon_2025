import mongoose, { Schema, Document } from 'mongoose'

export interface IArticle extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  summary: string
  link: string
  tags: string[]
  image: string
}

const ArticleSchema: Schema<IArticle> = new Schema({
  name: { type: String, required: true },
  summary: { type: String, required: true },
  link: { type: String, required: true },
  tags: [{ type: String, required: false }], // optional array, which is fine
  image: { type: String, required: false },
}, { timestamps: true }) // ⏰ Optional: adds createdAt/updatedAt for insights

export default mongoose.model<IArticle>('Article', ArticleSchema)
