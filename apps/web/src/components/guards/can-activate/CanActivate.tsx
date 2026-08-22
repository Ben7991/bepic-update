import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import type {
  AuthState,
  ChildrenOnlyProps,
} from '../../../lib/utils/types.utils';
import { useAppDispatch, useAppSelector } from '../../../store/index.util';
import { getAuthUser } from '../../../lib/utils/auth.utils';
import { setAuthUser } from '../../../store/slice/auth/auth.slice';
import { Loader } from '../../atoms/loader/Loader';

export function CanActivate({ children }: ChildrenOnlyProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [authState, setAuthState] = useState<AuthState>(
    user ? 'authenticated' : 'loading',
  );

  useEffect(() => {
    const fetchAuthUser = async (): Promise<void> => {
      try {
        const user = await getAuthUser();
        setAuthState('authenticated');
        dispatch(setAuthUser({ user }));
      } catch (error) {
        setAuthState('not-authenticated');
        console.error('Failed to fetch authenticated user', error);
      }
    };

    if (!user && authState === 'loading') {
      setTimeout(fetchAuthUser, 2000);
    }
  }, [dispatch, user, authState]);

  if (!user && authState === 'loading') {
    return <Loader />;
  }

  if (!user && authState === 'not-authenticated') {
    return <Navigate to="/" />;
  }

  return children;
}
