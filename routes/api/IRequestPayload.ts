import * as express from 'express';

export interface IRequestPayload extends express.Request {
  payload: any;
}
