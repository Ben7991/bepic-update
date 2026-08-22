import { motion } from 'motion/react';

import {
  DASHBOARD_PATHS,
  getActiveLinkClassnames,
  isMobileView,
} from './SideDrawer.utils';
import { Link, useLocation } from 'react-router';
import { Backdrop } from '../../atoms/backdrop/Backdrop';
import { UserProfile } from '../../molecules/user-profile/UserProfile';

type SideDrawerProps = {
  toggleDrawer: VoidFunction;
  state: boolean;
};

export function SideDrawer({
  state,
  toggleDrawer,
}: SideDrawerProps): React.JSX.Element {
  const { pathname } = useLocation();

  return (
    <>
      {state && isMobileView(1023) && <Backdrop onClick={toggleDrawer} />}
      <motion.aside
        animate={{ width: state ? '318.75px' : '0' }}
        className={`fixed top-0 left-0 h-screen ${state ? 'z-10' : ''} w-0 py-8 lg:py-10 overflow-hidden lg:static lg:h-auto lg:basis-67.5 xl:basis-75 bg-gray-200 overflow-y-auto`}
      >
        <div className="w-4/5 mx-auto">
          <UserProfile />
          <ul className="space-y-3">
            {DASHBOARD_PATHS.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={toggleDrawer}
                  className={`flex items-center gap-2 py-1 px-2.5 rounded-md ${getActiveLinkClassnames(pathname, item.path)}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>
    </>
  );
}
