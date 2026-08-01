import { swaggerServerErrorResponse } from '../utils/general.utils';

export const swaggerLoginResponse = {
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            example: {
              message: 'You are logged-in successfully',
              data: {
                user: {
                  id: '12345',
                  name: 'user',
                  role: '****',
                },
                token: {
                  accessToken: '****',
                  refreshToken: '****',
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Error',
      content: {
        'application/json': {
          schema: {
            example: {
              message: 'Invalid username and or password',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        },
      },
    },
    ...swaggerServerErrorResponse,
  },
};
