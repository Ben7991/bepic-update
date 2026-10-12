import { generateFormDataForProductCreation } from './Products.utils';

describe('Products.utils.ts', () => {
  describe('generateFormDataForProductCreation', () => {
    it('should add the image and product fields to form data', () => {
      const file = new File(['image content'], 'product.png', {
        type: 'image/png',
      });
      const data = {
        name: 'Product name',
        price: '12.50',
        point: '10',
      };

      const formData = generateFormDataForProductCreation(data, file);

      expect(formData.get('image')).toBe(file);
      expect(formData.get('name')).toBe('Product name');
      expect(formData.get('price')).toBe('12.50');
      expect(formData.get('point')).toBe('10');
    });
  });
});
