import { User } from './entities/user.entity';

export enum Status {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum Role {
  ADMIN = 'ADMIN',
  DISTRIBUTOR = 'DISTRIBUTOR',
}

export type LoginType = {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
};
