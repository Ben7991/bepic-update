'use client';

import { type Dispatch, type SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, UserRoundPen } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType } from 'yup';

import { login, loginSchema } from './Header.utils';
import { Button } from '@/components/atoms/button/Button';
import { Modal } from '../modal/Modal';
import { Form } from '@/components/atoms/form/Form';
import { Alert } from '@/components/molecules/alert/Alert';
import { type AlertInfoType, useAlert } from '@/lib/hooks/use-alert/useAlert';
import { useToggle } from '@/lib/hooks/use-toggle/useToggle';

export function DisplayLoginForm(): React.JSX.Element {
  const { show: showForm, toggle: toggleForm } = useToggle();
  const {
    alertInfo,
    setAlertInfo,
    state: alertState,
    hideAlert,
    showAlert,
  } = useAlert();

  return (
    <>
      <Alert
        show={alertState}
        variant={alertInfo?.variant}
        headline="Login"
        message={alertInfo?.message}
        onToggle={hideAlert}
      />
      <Button el="button" variant="primary" onClick={toggleForm}>
        Login
      </Button>
      {showForm && (
        <Modal
          state={showForm}
          title="Sign-in your account"
          onToggle={toggleForm}
        >
          <LoginForm onToggleAlert={showAlert} onSetAlertInfo={setAlertInfo} />
        </Modal>
      )}
    </>
  );
}

type LoginFormProps = {
  onToggleAlert: VoidFunction;
  onSetAlertInfo: Dispatch<SetStateAction<AlertInfoType | undefined>>;
};

function LoginForm({
  onToggleAlert,
  onSetAlertInfo,
}: LoginFormProps): React.JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<InferType<typeof loginSchema>> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      await login(data);
      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      onSetAlertInfo({
        message:
          error instanceof Error
            ? (error as Error).message
            : 'Something went wrong',
        variant: 'danger',
      });
    } finally {
      onToggleAlert();
    }

    setIsLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          type="text"
          id="username"
          {...register('username')}
          placeholder=""
          hasError={Boolean(errors.username)}
          leftIcon={<UserRoundPen width={20} height={20} />}
        />
        {Boolean(errors.username) && (
          <Form.Error>{errors.username?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          type="password"
          id="password"
          {...register('password')}
          hasError={Boolean(errors.password)}
          leftIcon={<Lock width={20} height={20} />}
        />
        {Boolean(errors.password) && (
          <Form.Error>{errors.password?.message}</Form.Error>
        )}
      </Form.Group>
      <Button type="submit" variant="primary" el="button" loading={isLoading}>
        Login
      </Button>
    </Form>
  );
}
