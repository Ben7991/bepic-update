import { useState, type MouseEvent, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { motion } from 'motion/react';

import logo from '../../../assets/icon.png';
import { Row } from '../../atoms/grid/Grid';
import { Form } from '../../atoms/form/Form';
import { Button } from '../../atoms/button/Button';
import { Headline } from '../../atoms/headline/Headline';
import { useOutsideClick } from '../../../lib/hooks/use-outside-click/useOutsideClick';
import { signOut } from './Dashboard.utils';
import { useAppDispatch } from '../../../store/index.util';
import { removeAuthUser } from '../../../store/slice/auth/auth.slice';

type DashboardHeaderProps = {
  toggleDrawer: VoidFunction;
  toggleLogoutModal: VoidFunction;
};

export function DashboardHeader({
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
    <header className="p-4 border-b border-b-gray-400 md:border-b-0 xl:px-6">
      <Row className="items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="hover:cursor-pointer border border-gray-400 rounded-sm py-1.5 px-2 lg:hidden"
            onClick={toggleDrawer}
          >
            <Menu className="w-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Energy888 logo" width={35} height={35} />
            <Headline tag="h4">Energy888</Headline>
          </div>
        </div>
        <div className="flex items-center gap-3 lg:gap-0">
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
                  className="absolute bg-white shadow-md top-6 right-0 w-55 border border-gray-100 rounded-sm flex flex-col"
                >
                  <Link
                    to="/dashboard/account-settings"
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
    </header>
  );
}

export function LogoutModalForm(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    await signOut();
    dispatch(removeAuthUser());
    navigate('/');
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
