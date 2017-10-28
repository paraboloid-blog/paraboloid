import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

let re = require('randexp');

export const username = new re(/[a-zA-Z0-9]{1,30}/).gen();
export const username_invalid = new re(/[^a-zA-Z0-9]{1,30}/).gen();
export const username_long = new re(/[a-zA-Z0-9]{31,}/).gen();
export const username_token = new re(/[a-zA-Z0-9]{1,30}/).gen();

export const email = new re(/\w{1,30}@\w{1,15}\.\w{1,3}/).gen();
export const email_long = new re(/\w{50,}@\w{1,15}\.\w{1,3}/).gen();
export const email_new = new re(/\w{1,30}@\w{1,15}\.\w{1,3}/).gen();
export const email_invalid = new re(/\w{1,50}/).gen();

export const password = new re(/\S{1,100}/).gen();
export const password_new = new re(/\S{1,100}/).gen();

export const bio = new re(/.{1,10000}/).gen();
export const bio_long = new re(/.{10001,}/).gen();
export const bio_new = new re(/.{1,10000}/).gen();

export const image = new re(/\w{1,196}\.\w{1,3}/).gen();
export const image_long = new re(/\w{200,}\.\w{1,3}/).gen();
export const image_new = new re(/\w{1,196}\.\w{1,3}/).gen();
export const image_invalid = new re(/\w{1,200}/).gen();

export const title = new re(/.{1,100}/).gen();

export const description = new re(/.{1,1000}/).gen();

export const body = new re(/.{1,100000}/).gen();

export const tags = (new re(/(\w{1,30},){1,}\w{1,30}/).gen()).split(',');

export const objectid = crypto.randomBytes(12).toString('hex');

export const token_user = jwt.sign({ username: username_token }, 'secret');
export const token_id = jwt.sign({ id: objectid }, 'secret');
export const token_invalid = jwt.sign({ username: username_token }, 'invalid');
