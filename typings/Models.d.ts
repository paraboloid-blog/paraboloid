declare interface IUser {
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
