import type { InferType } from 'yup';
import type { productSchema } from './Products.utils';
import type { AlertComponentProps } from '../../../lib/utils/types.utils';

export type Product = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  image: string;
  price: number;
  point: number;
};

export type ProductInputs = InferType<typeof productSchema>;

export type ProductFormProps = {
  action: string | null;
  idInSearchParams: string | null;
  onHideModal: VoidFunction;
} & Pick<AlertComponentProps, 'onShowAlert' | 'onSetAlertInfo'>;
