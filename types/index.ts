import {User} from '@prisma/client';

export type ErrorResponse = {
  message: string;
};

export type ClientUser = Omit<User, 'password' | 'resetToken' | 'resetExpiry'>;
