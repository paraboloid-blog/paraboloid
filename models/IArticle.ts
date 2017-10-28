import { Document } from 'mongoose';
import { IUser } from './IUser';
import { IComment } from './IComment';

export interface IArticle extends Document {
  slug: string,
  title: string,
  description: string,
  body: string,
  tagList: [string],
  author: IUser,
  comments: [IComment],
  getArticleJSON: () => void;
}
