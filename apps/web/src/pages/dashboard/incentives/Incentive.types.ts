import type { InferType } from 'yup';

import type { incentiveSchema } from './Incentives.utils';
import type { AlertComponentProps } from '../../../lib/utils/types.utils';

export type Incentive = {
  id: number;
  createdAt: string;
  updatedAt: string;
  point: number;
  award: string;
};

export type IncentiveInputs = InferType<typeof incentiveSchema>;

export type IncentiveFormProps = {
  action: string | null;
  idInSearchParams: string | null;
  onHideModal: VoidFunction;
} & Pick<
  AlertComponentProps,
  'onShowAlert' | 'onSetAlertInfo'
>;
