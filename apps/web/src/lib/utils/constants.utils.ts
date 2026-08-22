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

export const FAILED_STATUS_CODES: Array<number> = [
  StatusCodes.BAD_REQUEST,
  StatusCodes.VALIDATION_FAILED,
  StatusCodes.SERVER_ERROR,
  StatusCodes.FORBIDDEN,
  StatusCodes.NOT_FOUND,
];

export const AUTH_STATE = 'auth_state' as const;
export const AUTH_STATE_VALUE = 'yes' as const;
