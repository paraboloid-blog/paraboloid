import { Document } from 'mongoose';

export interface IUser extends Document {
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
