/**
 * api body property to create product
 */
export const apiBodyToCreateProduct = {
  name: {
    type: 'string',
  },
  price: {
    type: 'string',
  },
  point: {
    type: 'string',
  },
  image: {
    type: 'string',
    format: 'binary',
  },
};
