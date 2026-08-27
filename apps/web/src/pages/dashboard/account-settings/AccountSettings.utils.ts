import * as yup from 'yup';

import { getAccessToken, refreshToken } from '../../../lib/utils/auth.utils';
import {
  FAILED_STATUS_CODES,
  StatusCodes,
} from '../../../lib/utils/constants.utils';
import type { ResponseWithDataAndMessage } from '../../../lib/utils/types.utils';

export const changePersonalSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .matches(/^[A-Z]{1}[a-z]*$/, {
      message:
        'Only letters and first letter needs to be uppercase',
    })
    .trim(),
  lastName: yup
    .string()
    .required('Last name is required')
    .matches(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$/, {
      message:
        'Only letters, whitespace and first letter needs to be uppercase',
    })
    .trim(),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required').trim(),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Must be at least 8 characters')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
      message: 'Should contain at least an uppercase, number and a symbol',
    })
    .trim(),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .test({
      test: (value, ctx) => value === ctx.parent.newPassword,
      message: 'Passwords do not match each other',
    })
    .trim(),
});

export async function uploadProfileImage(
  file: File,
): Promise<ResponseWithDataAndMessage<{ imagePath: string }>> {
  const formdata = new FormData();
  formdata.append('image', file);

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/auth/change-image`,
    {
      method: 'POST',
      body: formdata,
      headers: {
        authorization: `Bearer ${getAccessToken()}`,
      },
      credentials: 'include',
    },
  );
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await uploadProfileImage(file);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export function splitName(name: string): Array<string> {
  const values = name.split(' ');
  return [values[0], values.slice(1).join(' ')];
}
