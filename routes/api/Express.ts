import * as express from 'express';

export interface RequestPayload extends express.Request {
  payload: any;
}
