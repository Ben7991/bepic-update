import * as yup from 'yup';

export const PRODUCT_COLUMNS_HEADING = [
  'Date Added',
  'Date Update',
  'Name',
  'Point',
  'Price',
  'Action',
];

export const productSchema = yup.object({
  name: yup.string().required('Name is required').trim(),
  price: yup
    .string()
    .required('Point is required')
    .matches(/^[0-9]+(\.[0-9]{2})?$/, {
      message: 'Invalid price value',
    }),
  point: yup
    .string()
    .required('Point is required')
    .matches(/^[0-9]*$/, {
      message: 'Only numbers are allowed',
    }),
});

/**
 * Generate form data for making the POST request
 * to create product
 *
 * @param data - inputs data in the product form except the file upload
 * @param file - the uploaded file
 * @returns a formdata containing the data and uploaded file
 */
export function generateFormDataForProductCreation(
  data: { [p: string]: string },
  file: File,
): FormData {
  const formdata = new FormData();
  formdata.append('image', file);

  for (const key in data) {
    formdata.append(key, data[key]);
  }

  return formdata;
}
