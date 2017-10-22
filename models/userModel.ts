import * as uniqueValidator from 'mongoose-unique-validator';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as debug from 'debug';
import * as config from '../config';
import { IUser } from './IUser';
import { Schema, Model, model } from 'mongoose';

let log = debug('paraboloid:server:models:user');

let UserSchema: Schema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true,
    maxlength: 30
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    maxlength: 50
  },
  bio: {
    type: String,
    maxlength: 10000
  },
  image: {
    type: String,
    maxlength: 200,
    match: [/\S+\.\S+/, 'is invalid'],
  },
  hash: {
    type: String,
    required: [true, "can't be blank"]
  },
  salt: {
    type: String,
    required: [true, "can't be blank"],
  }
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function(password: string): boolean {
  log('Password %o is checked', password);
  if (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    log('Comparision of user and password hashes succeeded: %o', hash === this.hash);
    return this.hash === hash;
  }
  else return false;
};

UserSchema.methods.setPassword = function(password: string): void {
  log('password %o', password);
  if (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    log('hash %o and salt %o generated', this.hash, this.salt);
  }
};

UserSchema.methods.generateJWT = function(): string {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  log('JWT generated for %o until %o', this.username, exp);
  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: exp.getTime() / 1000,
  }, config.secret);
};

UserSchema.methods.toAuthJSON = function(): object {
  let token = {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  };
  log('JWT token: %o', token);
  return token;
};

export const UserModel: Model<IUser> = model<IUser>('User', UserSchema);
