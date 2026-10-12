import * as yup from 'yup';

export const incentiveSchema = yup.object({
  point: yup
    .string()
    .required('Point is required')
    .matches(/^[0-9]*$/, {
      message: 'Only numbers are allowed',
    }),
  award: yup.string().required('Award is required').trim(),
});
