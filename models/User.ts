import * as uniqueValidator from 'mongoose-unique-validator';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as debug from 'debug';
import * as config from '../config';
import { Document, Schema, Model, model } from 'mongoose';

let log = debug('paraboloid:Server:Models:User');

interface IUser extends Document {
  username: string;
  email: string;
  bio: string;
  image: string;
  hash: string;
  salt: string;
  validPassword: (password: string) => boolean;
  setPassword: (password: string) => void;
  toAuthJSON: () => object;
}

let UserSchema: Schema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  bio: String,
  image: String,
  hash: String,
  salt: String,
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function(password: string): boolean {
  let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  log('Hash %o is compared to user hash %o', hash, this.hash);
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password: string): void {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  log('Hash %o and salt %o generated for password %o', this.hash, this.salt, password);
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
