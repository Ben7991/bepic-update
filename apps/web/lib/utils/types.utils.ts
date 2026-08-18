export type ChildrenOnlyProps = {
  children: React.ReactNode;
};

export type ResponseWithDataAndMessage<T> = {
  message: string;
  data: T;
};

export type ResponseWithOnlyData<T> = {
  data: T;
};

export type ResponseWithRecord<T> = {
  count: number;
  data: Array<T>;
};

export const StatusCodes = {
  CREATED: 201,
  SUCCESS: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UN_AUTHORIZED: 401,
  FORBIDDEN: 403,
  VALIDATION_FAILED: 422,
  SERVER_ERROR: 500,
} as const;

export enum Role {
  ADMIN = 'ADMIN',
  DISTRIBUTOR = 'DISTRIBUTOR',
}

export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  username: string;
  role: Role;
};
