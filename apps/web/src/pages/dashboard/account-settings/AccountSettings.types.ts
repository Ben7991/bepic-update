import type { InferType } from 'yup';

import {
  changePasswordSchema,
  changePersonalSchema,
} from './AccountSettings.utils';
import type { AlertInfoType } from '../../../lib/hooks/use-alert/useAlert';

export type TabHeaderProps = {
  headline: string;
  description: string;
};

export type ChangePersonalInputs = InferType<typeof changePersonalSchema>;
export type ChangePasswordInputs = InferType<typeof changePasswordSchema>;

export type AccountSettingsHeaderProps = {
  onShowAlert: VoidFunction;
  onSetAlertInfo: React.Dispatch<
    React.SetStateAction<AlertInfoType | undefined>
  >;
};

export type ChangePersonalProps = Pick<
  AccountSettingsHeaderProps,
  'onSetAlertInfo' | 'onShowAlert'
>;

export type ChangePasswordProps = Pick<
  AccountSettingsHeaderProps,
  'onSetAlertInfo' | 'onShowAlert'
>;
