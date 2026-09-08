import { useState, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { InferType } from 'yup';
import { Lock, UserRoundPen } from 'lucide-react';

import { Button } from '../../atoms/button/Button';
import { login, loginSchema } from './Header.utils';
import {
  useAlert,
  type AlertInfoType,
} from '../../../lib/hooks/use-alert/useAlert';
import { useToggle } from '../../../lib/hooks/use-toggle/useToggle';
import { Form } from '../../atoms/form/Form';
import { Alert } from '../../molecules/alert/Alert';
import { Modal } from '../modal/Modal';
import { useAppDispatch } from '../../../store/index.util';
import { setAuthUser } from '../../../store/slice/auth/auth.slice';

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      const result = await login(data);
      dispatch(
        setAuthUser({
          user: result.data,
        }),
      );
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      onSetAlertInfo({
        message:
          error instanceof Error
            ? (error as Error).message
            : 'Something went wrong',
        variant: 'danger',
      });
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
          leftIcon={<UserRoundPen className="w-4" />}
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
          leftIcon={<Lock className="w-4" />}
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
