import * as express from 'express';
import { IArticle } from '../../models';

export interface IRequestExt extends express.Request {
  payload: any;
  article: IArticle;
}
