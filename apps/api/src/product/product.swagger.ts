import { swaggerServerErrorResponse } from '../utils/general.utils';

export const swaggerGetProductsResponse = {
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            example: {
              count: 1,
              data: [
                {
                  id: '7',
                  createdAt: '2026-09-29T19:46:40.160Z',
                  updatedAt: '2026-09-29T19:46:40.160Z',
                  name: 'Lokus tea',
                  image: 'uploads/products/1790711200155-143621489.jpg',
                  price: 120,
                  point: 50,
                },
              ],
            },
          },
        },
      },
    },
    ...swaggerServerErrorResponse,
  },
};

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

export const swaggerUpdateProductResponse = {
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            example: {
              message: 'Product updated successfully',
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
    422: {
      description: 'Error',
      content: {
        'application/json': {
          schema: {
            example: {
              message: 'Product not recognized',
              error: 'Bad Request',
              statusCode: 422,
            },
          },
        },
      },
    },
    ...swaggerServerErrorResponse,
  },
};

export const swaggerChangeImageResponse = {
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            example: {
              message: 'Product image uploaded successfully',
              data: {
                image: 'abcd.png',
              },
            },
          },
        },
      },
    },
    422: {
      description: 'Error',
      content: {
        'application/json': {
          schema: {
            example: {
              message: 'Image size must be less than or equal to 2MB',
              error: 'BadRequest',
              statusCode: 422,
            },
          },
        },
      },
    },
    ...swaggerServerErrorResponse,
  },
};
