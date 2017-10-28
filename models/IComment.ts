import { Document } from 'mongoose';
import { IUser } from './IUser';
import { IArticle } from './IArticle';

export interface IComment extends Document {
  body: string,
  author: IUser,
  article: IArticle
}
