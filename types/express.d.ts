import { IUser } from '../src/user/type';

export default {};

declare module 'express' {
  interface Request {
    user: IUser;
  }
}
