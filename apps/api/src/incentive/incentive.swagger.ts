import { swaggerServerErrorResponse } from '../utils/general.utils';

export const swaggerCreateIncentiveResponse = {
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            example: {
              message: 'Incentive added successfully',
              data: {
                id: '1',
                createdAt: '2026-08-28T09:13:38.450Z',
                updatedAt: '2026-08-28T09:13:38.450Z',
                point: 7000,
                award: 'Electronic',
                status: 'ACTIVE',
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
              message: 'No duplicate entries are allowed',
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
