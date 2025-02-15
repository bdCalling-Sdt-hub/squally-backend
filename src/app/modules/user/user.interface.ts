import { Model, Schema } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  appId: string;
  role: USER_ROLES;
  contact: string;
  email: string;
  password: string;
  about: string;
  location: string;
  profile?: string;
  gender?: string;
  status: 'active' | 'delete';
  verified: boolean;
  lesson?: Schema.Types.ObjectId;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  }
  accountInformation?: {
    status: boolean;
    stripeAccountId: string;
    externalAccountId: string;
    currency: string;
    accountUrl: string;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isAccountCreated(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
