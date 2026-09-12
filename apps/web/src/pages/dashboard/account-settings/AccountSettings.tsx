import { Link, useSearchParams } from 'react-router';

import {
  AccountSettingsHeader,
  ChangePassword,
  ChangePersonal,
} from './AccountSettings.partials';
import { useAlertPopup } from '../../../lib/hooks/use-alert-popup/useAlertPopup';
import { AlertPopup } from '../../../components/molecules/alert-popup/AlertPopup';
import { ErrorBoundary } from '../../errors/error-boundary/ErrorBoundary';

export default function AccountSettings(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const {
    alertInfo,
    setAlertInfo,
    state: alertState,
    hideAlert,
    showAlert,
  } = useAlertPopup();

  const activeTab = searchParams.get('tab') as
    'personal' | 'password' | undefined;

  if (!activeTab || !['personal', 'password'].includes(activeTab)) {
    return (
      <ErrorBoundary
        resetLink="/dashboard/account-settings?tab=personal"
        message="Either tab is not provided or isn't recognized"
      />
    );
  }

  return (
    <>
      <AlertPopup
        show={alertState}
        variant={alertInfo?.variant}
        headline="Login"
        message={alertInfo?.message}
        onToggle={hideAlert}
      />
      <article className="py-5 md:py-10 md:flex md:flex-col md:items-center">
        <AccountSettingsHeader
          onShowAlert={showAlert}
          onSetAlertInfo={setAlertInfo}
        />

        <div className="w-fit bg-gray-50 flex gap-1 p-1 rounded-md border border-gray-200 mb-5 mx-auto md:mx-0">
          <Link
            to="/dashboard/account-settings?tab=personal"
            className={`py-1 px-3 rounded-md ${activeTab === 'personal' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
          >
            Personal Info
          </Link>
          <Link
            to="/dashboard/account-settings?tab=password"
            className={`py-1 px-3 rounded-md ${activeTab === 'password' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
          >
            Change Password
          </Link>
        </div>

        <div className="w-full md:w-112.5">
          {activeTab === 'personal' ? (
            <ChangePersonal
              onShowAlert={showAlert}
              onSetAlertInfo={setAlertInfo}
            />
          ) : activeTab === 'password' ? (
            <ChangePassword
              onShowAlert={showAlert}
              onSetAlertInfo={setAlertInfo}
            />
          ) : null}
        </div>
      </article>
    </>
  );
}
