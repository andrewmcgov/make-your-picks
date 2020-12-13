import {User} from '@prisma/client';

export type ErrorResponse = {
  message: string;
};

export type ClientUser = Omit<User, 'password' | 'resetToken' | 'resetExpiry'>;

export type ClientUserResponse = {
  currentUser: ClientUser | null;
};

export enum CacheKey {
  CurrentUser = 'CURRENT_USER',
}

export type CreateUserResponse = {
  success: true;
};
