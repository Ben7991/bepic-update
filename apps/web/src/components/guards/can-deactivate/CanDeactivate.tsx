import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import { Loader } from '../../atoms/loader/Loader';
import { useAppDispatch, useAppSelector } from '../../../store/index.util';
import { getAuthUser } from '../../../lib/utils/auth.utils';
import { setAuthUser } from '../../../store/slice/auth/auth.slice';
import type {
  AuthState,
  ChildrenOnlyProps,
} from '../../../lib/utils/types.utils';

export function CanDeactivate({
  children,
}: ChildrenOnlyProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [state, setState] = useState<AuthState>(
    user ? 'authenticated' : 'loading',
  );

  useEffect(() => {
    const fetchAuthUser = async (): Promise<void> => {
      try {
        const user = await getAuthUser();
        setState('authenticated');
        dispatch(setAuthUser({ user }));
      } catch (error) {
        setState('not-authenticated');
        console.error('Failed to fetch authenticated user', error);
      }
    };

    if (!user) {
      fetchAuthUser();
    }
  }, [dispatch, user]);

  if (!user && state === 'loading') {
    return <Loader />;
  }

  if (user && state === 'authenticated') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
