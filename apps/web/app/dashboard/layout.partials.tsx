'use client';

import { FormEvent, MouseEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { type ChildrenOnlyProps } from '@/utils/utils.types';
import { Container, Row } from '@/components/atoms/grid/Grid';
import { Headline } from '@/components/atoms/headline/Headline';
import { SideDrawer } from '@/components/organisms/side-drawer/SideDrawer';
import { useOutsideClick } from '@/lib/hooks/use-outside-click/useOutsideClick';
import { Modal } from '@/components/organisms/modal/Modal';
import { Form } from '@/components/atoms/form/Form';
import { Button } from '@/components/atoms/button/Button';
import { useRouter } from 'next/navigation';

export function DashboardLayoutContent({
  children,
}: ChildrenOnlyProps): React.JSX.Element {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleDrawer = (): void => {
    setShowDrawer(!showDrawer);
  };

  const toggleLogoutModal = (): void => {
    setShowLogoutModal(!showLogoutModal);
  };

  return (
    <>
      <SideDrawer state={showDrawer} toggleDrawer={toggleDrawer} />
      <article className="grow">
        <DashboardHeader
          toggleDrawer={toggleDrawer}
          toggleLogoutModal={toggleLogoutModal}
        />
        <Container className="py-3">{children}</Container>
      </article>
      <Modal
        onToggle={toggleLogoutModal}
        state={showLogoutModal}
        title="Logout"
      >
        <LogoutModalForm />
      </Modal>
    </>
  );
}

type DashboardHeaderProps = {
  toggleDrawer: VoidFunction;
  toggleLogoutModal: VoidFunction;
};

function DashboardHeader({
  toggleDrawer,
  toggleLogoutModal,
}: DashboardHeaderProps): React.JSX.Element {
  const [showMenu, setShowMenu] = useState(false);

  useOutsideClick((): void => {
    setShowMenu(false);
  });

  const toggleMenu = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <header className="py-4">
      <Container>
        <Row className="items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="hover:cursor-pointer border border-gray-500 rounded-sm py-1.5 px-2 lg:hidden"
              onClick={toggleDrawer}
            >
              <Menu />
            </button>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Energy888 logo"
                width={35}
                height={35}
              />
              <Headline tag="h4">Energy888</Headline>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleMenu} className="flex items-center">
              <UserRound />
            </button>
            <div className="relative">
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    className="absolute bg-white shadow-md top-10 right-0 w-55 border border-gray-100 rounded-sm flex flex-col"
                  >
                    <Link
                      href="/dashboard/account-settings"
                      className="flex items-center gap-2 py-1.5 px-3 hover:bg-gray-100"
                    >
                      <Settings className="w-4" />
                      <span>Account Settings</span>
                    </Link>
                    <button
                      onClick={toggleLogoutModal}
                      className="flex items-center gap-2 py-1.5 px-3 hover:bg-gray-100 w-full hover:cursor-pointer"
                    >
                      <LogOut className="w-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
}

function LogoutModalForm(): React.JSX.Element {
  const router = useRouter();

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    router.push('/');
  };

  return (
    <Form onSubmit={onSubmit}>
      <p className="mb-4">
        Are you sure you want to logout of the application?
      </p>
      <Form.Group className="flex gap-2">
        <Button
          el="button"
          variant="primary"
          className="flex! items-center gap-2"
          type="submit"
        >
          <LogOut className="w-4" />
          <span>Yes, logout</span>
        </Button>
      </Form.Group>
    </Form>
  );
}
