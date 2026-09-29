import { swaggerServerErrorResponse } from '../utils/general.utils';

export const swaggerCreateProductResponse = {
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            example: {
              message: 'Product added successfully',
              data: {
                id: '7',
                createdAt: '2026-09-29T19:46:40.160Z',
                updatedAt: '2026-09-29T19:46:40.160Z',
                name: 'Lokus tea',
                image: 'uploads/products/1790711200155-143621489.jpg',
                price: 120,
                point: 50,
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
              message: 'No duplicate product names are allowed',
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
