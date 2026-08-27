import { useRef, useState, type ChangeEvent } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Save } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Camera } from 'lucide-react';

import placeholderProfile from '../../../assets/user-profile.svg';
import { Form } from '../../../components/atoms/form/Form';
import { Headline } from '../../../components/atoms/headline/Headline';
import type {
  AccountSettingsHeaderProps,
  ChangePasswordInputs,
  ChangePasswordProps,
  ChangePersonalInputs,
  ChangePersonalProps,
  TabHeaderProps,
} from './AccountSettings.types';
import {
  changePasswordSchema,
  changePersonalSchema,
  splitName,
  uploadProfileImage,
} from './AccountSettings.utils';
import { Button } from '../../../components/atoms/button/Button';
import { useAppDispatch, useAppSelector } from '../../../store/index.util';
import { Spinner } from '../../../components/atoms/spinner/Spinner';
import {
  changeImagePath,
  changeName,
  removeAuthUser,
} from '../../../store/slice/auth/auth.slice';
import type { AlertProps } from '../../../components/molecules/alert/Alert';
import { mutate } from '../../../lib/http/http-request';
import type { ResponseWithOnlyMessage } from '../../../lib/utils/types.utils';
import { useNavigate } from 'react-router';
import { signOut } from '../../../components/layouts/dashboard/Dashboard.utils';
import { TogglePassword } from '../../../components/molecules/toggle-password/TogglePassword';

export function AccountSettingsHeader({
  onShowAlert,
  onSetAlertInfo,
}: AccountSettingsHeaderProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const user = useAppSelector((state) => state.auth.user);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', async () => {
      await uploadImage(file);
    });
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<void> => {
    setIsUploading(true);

    let message = '',
      variant: AlertProps['variant'] = 'success';

    try {
      const result = await uploadProfileImage(file);
      dispatch(
        changeImagePath({
          imagePath: result.data.imagePath,
        }),
      );
      message = result.message;
    } catch (error) {
      message = (error as Error).message ?? 'Something went wrong';
      variant = 'danger';
    } finally {
      setIsUploading(false);
      onSetAlertInfo({
        message,
        variant,
      });
      onShowAlert();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6 mb-6">
      <div className="relative w-fit">
        {user?.imagePath ? (
          <div className="relative">
            <img
              src={`${import.meta.env.VITE_BASE_SERVER}/${user.imagePath}`}
              alt="User profile"
              className="object-cover rounded-full w-50 h-50 md:w-40 md:h-40 xl:w-52 xl:h-52 border border-gray-200"
            />
            {isUploading && (
              <div className="absolute top-0 left-0 flex items-center justify-center rounded-full w-50 h-50 md:w-40 md:h-40 xl:w-52 xl:h-52 border border-gray-200 bg-gray-700/50">
                <Spinner size="md" color="white" />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-full flex items-center justify-center w-50 h-50 md:w-40 md:h-40 xl:w-52 xl:h-52 border border-gray-200">
            <img
              src={placeholderProfile}
              alt="Generic user image"
              className="w-2/3"
            />
          </div>
        )}
        <input
          type="file"
          hidden
          ref={uploadInputRef}
          onChange={handleInputChange}
        />
        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          className="absolute bottom-7 -right-2 xl:right-0 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center w-9 h-9 rounded-full cursor-pointer"
        >
          <Camera className="w-5" />
        </button>
      </div>
      <div className="text-center md:text-left">
        <Headline tag="h2">{user?.name}</Headline>
        <span className="inline-block uppercase text-[1.15em]">
          {user?.role}
        </span>
      </div>
    </div>
  );
}

function TabHeader({
  headline,
  description,
}: TabHeaderProps): React.JSX.Element {
  return (
    <div className="mb-5">
      <Headline tag="h4">{headline}</Headline>
      <p className="mb-3">{description}</p>
      <div className="w-32 h-1 bg-gray-400 rounded-sm" />
    </div>
  );
}

export function ChangePersonal({
  onShowAlert,
  onSetAlertInfo,
}: ChangePersonalProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const [firstName, lastName] = splitName(authUser!.name!);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePersonalInputs>({
    mode: 'onBlur',
    resolver: yupResolver(changePersonalSchema),
    defaultValues: {
      firstName,
      lastName,
    },
  });

  const onSubmit: SubmitHandler<ChangePersonalInputs> = async (
    data,
  ): Promise<void> => {
    const fullName = `${data.firstName} ${data.lastName}`;

    if (fullName === authUser?.name)
      return;

    setIsLoading(true);

    let message = '',
      variant: AlertProps['variant'] = 'success';

    try {
      const result = await mutate<ResponseWithOnlyMessage>(
        'POST',
        'auth/personal-info',
        {
          name: fullName,
        },
      );
      message = result.message;
      dispatch(
        changeName({
          name: fullName,
        }),
      );
    } catch (error) {
      message = (error as Error).message ?? 'Something went wrong';
      variant = 'danger';
    } finally {
      setIsLoading(false);
      onSetAlertInfo({
        message,
        variant,
      });
      onShowAlert();
    }
  };

  return (
    <>
      <TabHeader
        headline="Personal Info"
        description="Manage your personal info"
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="firstName">First name</Form.Label>
          <Form.Control
            type="text"
            id="firstName"
            {...register('firstName')}
            hasError={Boolean(errors.firstName)}
          />
          {Boolean(errors.firstName) && (
            <Form.Error>{errors.firstName?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-5">
          <Form.Label htmlFor="lastName">Last name</Form.Label>
          <Form.Control
            type="text"
            id="lastName"
            {...register('lastName')}
            hasError={Boolean(errors.lastName)}
          />
          {Boolean(errors.lastName) && (
            <Form.Error>{errors.lastName?.message}</Form.Error>
          )}
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          el="button"
          className="flex! items-center gap-1"
          loading={isLoading}
        >
          <Save className="w-4" />
          <span>Save changes</span>
        </Button>
      </Form>
    </>
  );
}

export function ChangePassword({
  onShowAlert,
  onSetAlertInfo,
}: ChangePasswordProps): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({
    isCurrentPasswordVisible: false,
    isNewPasswordVisible: false,
    isConfirmPasswordVisible: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInputs>({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit: SubmitHandler<ChangePasswordInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      await mutate<ResponseWithOnlyMessage>('POST', 'auth/password', data);
      await signOut();
      dispatch(removeAuthUser());
      navigate('/');
    } catch (error) {
      onSetAlertInfo({
        message: (error as Error).message ?? 'Something went wrong',
        variant: 'danger',
      });
      onShowAlert();
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (
    input: 'current' | 'new' | 'confirm',
  ): void => {
    switch (input) {
      case 'current':
        setPasswordVisible((prevVisibility) => ({
          ...prevVisibility,
          isCurrentPasswordVisible: !prevVisibility.isCurrentPasswordVisible,
        }));
        break;
      case 'new':
        setPasswordVisible((prevVisibility) => ({
          ...prevVisibility,
          isNewPasswordVisible: !prevVisibility.isNewPasswordVisible,
        }));
        break;
      case 'confirm':
        setPasswordVisible((prevVisibility) => ({
          ...prevVisibility,
          isConfirmPasswordVisible: !prevVisibility.isConfirmPasswordVisible,
        }));
        break;
    }
  };

  return (
    <>
      <TabHeader
        headline="Password"
        description="Change your password here, after successful update the system will log you out to try out your new password."
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="currentPassword">Current Password</Form.Label>
          <Form.Control
            type={
              passwordVisible.isCurrentPasswordVisible ? 'text' : 'password'
            }
            id="name"
            {...register('currentPassword')}
            hasError={Boolean(errors.currentPassword)}
            rightIcon={
              <TogglePassword
                state={passwordVisible.isCurrentPasswordVisible}
                onClick={() => togglePasswordVisibility('current')}
              />
            }
          />
          {Boolean(errors.currentPassword) && (
            <Form.Error>{errors.currentPassword?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="newPassword">New password</Form.Label>
          <Form.Control
            type={
              passwordVisible.isNewPasswordVisible ? 'text' : 'password'
            }
            id="newPassword"
            {...register('newPassword')}
            hasError={Boolean(errors.newPassword)}
            rightIcon={
              <TogglePassword
                state={passwordVisible.isNewPasswordVisible}
                onClick={() => togglePasswordVisibility('new')}
              />
            }
          />
          {Boolean(errors.newPassword) && (
            <Form.Error>{errors.newPassword?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-5">
          <Form.Label htmlFor="confirmPassword">Confirm password</Form.Label>
          <Form.Control
            type={
              passwordVisible.isConfirmPasswordVisible ? 'text' : 'password'
            }
            id="confirmPassword"
            {...register('confirmPassword')}
            hasError={Boolean(errors.confirmPassword)}
            rightIcon={
              <TogglePassword
                state={passwordVisible.isConfirmPasswordVisible}
                onClick={() => togglePasswordVisibility('confirm')}
              />
            }
          />
          {Boolean(errors.confirmPassword) && (
            <Form.Error>{errors.confirmPassword?.message}</Form.Error>
          )}
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          el="button"
          className="flex! items-center gap-1"
          loading={isLoading}
        >
          <Save className="w-4" />
          <span>Save changes</span>
        </Button>
      </Form>
    </>
  );
}
