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

export type ServerErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};

export type AuthState = 'loading' | 'authenticated' | 'not-authenticated';

export type Role = 'ADMIN' | 'DISTRIBUTOR';

export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  username: string;
  role: Role;
  imagePath?: string;
};
