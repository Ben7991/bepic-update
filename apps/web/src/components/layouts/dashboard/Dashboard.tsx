import { useState } from 'react';
import { Outlet } from 'react-router';

import { Modal } from '../../organisms/modal/Modal';
import { SideDrawer } from '../../organisms/side-drawer/SideDrawer';
import { DashboardHeader, LogoutModalForm } from './Dashboard.partials';

export default function Dashboard(): React.JSX.Element {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleLogoutModal = (): void => {
    setShowLogoutModal(!showLogoutModal);
  };

  return (
    <main className="lg:flex lg:w-full lg:h-screen lg:overflow-hidden">
      <SideDrawer state={showDrawer} onHideDrawer={() => setShowDrawer(false)} />
      <article className="grow bg-gray-50 flex flex-col">
        <DashboardHeader
          toggleDrawer={() => setShowDrawer(true)}
          toggleLogoutModal={toggleLogoutModal}
        />
        <div className="p-4 md:px-4 md:pb-10 md:pt-0 xl:px-6 lg:overflow-auto">
          <Outlet />
        </div>
      </article>
      <Modal
        onToggle={toggleLogoutModal}
        state={showLogoutModal}
        title="Logout"
      >
        <LogoutModalForm />
      </Modal>
    </main>
  );
}
