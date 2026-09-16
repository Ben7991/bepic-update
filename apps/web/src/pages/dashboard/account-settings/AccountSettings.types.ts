import type { InferType } from 'yup';

import {
  changePasswordSchema,
  changePersonalSchema,
} from './AccountSettings.utils';
import type { AlertComponentProps } from '../../../lib/utils/types.utils';

export type TabHeaderProps = {
  headline: string;
  description: string;
};

export type ChangePersonalInputs = InferType<typeof changePersonalSchema>;
export type ChangePasswordInputs = InferType<typeof changePasswordSchema>;

export type ChangePersonalProps = Pick<
  AlertComponentProps,
  'onSetAlertInfo' | 'onShowAlert'
>;

export type ChangePasswordProps = Pick<
  AlertComponentProps,
  'onSetAlertInfo' | 'onShowAlert'
>;
