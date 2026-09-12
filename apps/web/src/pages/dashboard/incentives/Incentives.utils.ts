import * as yup from 'yup';
import type { Incentive } from './Incentive.types';

export const incentiveSchema = yup.object({
  point: yup
    .string()
    .required('Point is required')
    .matches(/^[0-9]*$/, {
      message: 'Only numbers are allowed',
    }),
  award: yup.string().required('Award is required').trim(),
});

export function getPreferredIncentive(
  incentives: Array<Incentive>,
  id: string | null,
): Incentive | undefined {
  if (!id)
    return undefined;

  const parsedId = Number(id);
  return incentives.find((incentive) => incentive.id === parsedId);
}
