'use client';

import { MouseEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { type ChildrenOnlyProps } from '@/utils/utils.types';
import { Container, Row } from '@/components/atoms/grid/Grid';
import { Headline } from '@/components/atoms/headline/Headline';
import { SideDrawer } from '@/components/organisms/side-drawer/SideDrawer';
import { useOutsideClick } from '@/lib/hooks/use-outside-click/useOutsideClick';

export function DashboardLayoutContent({
  children,
}: ChildrenOnlyProps): React.JSX.Element {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawer = (): void => {
    setShowDrawer(!showDrawer);
  };

  return (
    <>
      <SideDrawer state={showDrawer} toggleDrawer={toggleDrawer} />
      <article className="grow">
        <DashboardHeader toggleDrawer={toggleDrawer} />
        <Container className="py-3">{children}</Container>
      </article>
    </>
  );
}

type DashboardHeaderProps = {
  toggleDrawer: VoidFunction;
};

function DashboardHeader({
  toggleDrawer,
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
                    <button className="flex items-center gap-2 py-1.5 px-3 hover:bg-gray-100 w-full hover:cursor-pointer">
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
