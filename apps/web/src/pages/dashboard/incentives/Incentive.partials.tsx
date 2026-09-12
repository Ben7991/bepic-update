import { useEffect, useState, type SubmitEvent } from 'react';
import { Save } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '../../../components/atoms/button/Button';
import { Form } from '../../../components/atoms/form/Form';
import { getPreferredIncentive, incentiveSchema } from './Incentives.utils';
import { useToggle } from '../../../lib/hooks/use-toggle/useToggle';
import { destroy, mutate } from '../../../lib/http/http-request';
import type { ResponseWithDataAndMessage } from '../../../lib/utils/types.utils';
import type {
  Incentive,
  IncentiveFormProps,
  IncentiveInputs,
} from './Incentive.types';
import { useAppDispatch, useAppSelector } from '../../../store/index.util';
import {
  addIncentive,
  removeIncentive,
  updateIncentive,
} from '../../../store/slice/incentives/incentive.slice';
import type { AlertPopupProps } from '../../../components/molecules/alert-popup/AlertPopup';
import { Alert } from '../../../components/molecules/alert/Alert';

export function IncentiveForm({
  action,
  idInSearchParams,
  onShowAlert,
  onSetAlertInfo,
  onHideModal,
}: IncentiveFormProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [hasParamsError, setHasParamsError] = useState(false);
  const { data: incentives } = useAppSelector((state) => state.incentive);
  const { show: isLoading, toggle: toggleLoading } = useToggle();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValues,
  } = useForm<IncentiveInputs>({
    resolver: yupResolver(incentiveSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (Number.isNaN(Number(idInSearchParams)) && !hasParamsError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasParamsError((prevValue) => !prevValue);
    } else {
      const preferredIncentive = getPreferredIncentive(
        incentives,
        idInSearchParams,
      );
      setValues({
        award: preferredIncentive?.award,
        point: preferredIncentive?.point?.toString(),
      });
    }
  }, [idInSearchParams, incentives, setValues, hasParamsError]);

  const onSubmit: SubmitHandler<IncentiveInputs> = async (
    data,
  ): Promise<void> => {
    toggleLoading();

    let message = '',
      variant: AlertPopupProps['variant'] = 'success';

    const preferredIncentive = getPreferredIncentive(incentives, idInSearchParams);
    let result: ResponseWithDataAndMessage<Incentive> | undefined;

    try {
      result = await mutate<ResponseWithDataAndMessage<Incentive>>(
        preferredIncentive ? 'PATCH' : 'POST',
        preferredIncentive
          ? `incentives/${preferredIncentive.id}`
          : 'incentives',
        {
          ...data,
          point: Number(data.point),
        },
      );

      if (preferredIncentive) dispatch(updateIncentive(result.data));
      else dispatch(addIncentive(result.data));

      reset();
      message = result.message;
    } catch (error) {
      console.error('Error encountered: ', error);
      message = (error as Error).message;
      variant = 'danger';
    } finally {
      toggleLoading();
      onSetAlertInfo({ message, variant });
      onShowAlert();

      if (preferredIncentive) onHideModal();
    }
  };

  const handleDeleteSubmit = async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    toggleLoading();

    let message = '',
      variant: AlertPopupProps['variant'] = 'success';

    try {
      const parsedId = Number(idInSearchParams);
      const result = await destroy(`incentives/${parsedId}`);
      dispatch(removeIncentive(parsedId))
      message = result.message
    } catch(error) {
      console.error('Error encountered: ', error);
      message = (error as Error).message;
      variant = 'danger';
    } finally {
      toggleLoading();
      onSetAlertInfo({ message, variant });
      onShowAlert();
    }

    if (variant === 'success')
      onHideModal();
  }

  if (hasParamsError) {
    return (
      <Alert headline="Eror in url params" variant="danger">
        <Alert.Message>
          Please do not manipulate the{' '}
          <em>
            <strong>id</strong>
          </em>{' '}
          in the <strong>url</strong>
        </Alert.Message>
      </Alert>
    );
  }

  if (action === 'delete') {
    return (
      <Form onSubmit={handleDeleteSubmit}>
        <p className="mb-3">
          Are you sure you want to delete this incentive?. Please note that once
          you do, it will not be available in the application any longer but
          will be visible in all other related parts of the application.
        </p>
        <p className="mb-4">
          <strong>NB:</strong> you re-add it again anytime you want and it will
          be visible in all other related parts of the application
        </p>
        <Button
          el="button"
          variant="danger"
          className="flex! items-center gap-1"
          loading={isLoading}
        >
          <Save width={16} height={16} />
          <span>Yes, please it delete already</span>
        </Button>
      </Form>
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="point">Point</Form.Label>
        <Form.Control
          type="number"
          id="point"
          {...register('point')}
          hasError={Boolean(errors.point)}
        />
        {Boolean(errors.point) && (
          <Form.Error>{errors.point?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group className="mb-5">
        <Form.Label htmlFor="award">Award</Form.Label>
        <Form.Control
          type="text"
          id="award"
          {...register('award')}
          hasError={Boolean(errors.award)}
        />
        {Boolean(errors.award) && (
          <Form.Error>{errors.award?.message}</Form.Error>
        )}
      </Form.Group>
      <Button
        el="button"
        variant="primary"
        className="flex! items-center gap-1"
        loading={isLoading}
      >
        <Save width={16} height={16} />
        <span>Submit</span>
      </Button>
    </Form>
  );
}
