import { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  slug: string,
  title: string,
  description: string,
  body: string,
  tagList: [string],
  author: Schema.Types.ObjectId,
  comments: [Schema.Types.ObjectId],
  slugify: () => void;
  getArticleJSON: () => void;
}
