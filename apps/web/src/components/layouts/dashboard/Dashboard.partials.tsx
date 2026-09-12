import {
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type SubmitEvent,
} from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { ChevronDown, LogOut, Menu, Search, Settings } from 'lucide-react';
import { motion } from 'motion/react';

import { Row } from '../../atoms/grid/Grid';
import { Form } from '../../atoms/form/Form';
import { Button } from '../../atoms/button/Button';
import { Headline } from '../../atoms/headline/Headline';
import { useOutsideClick } from '../../../lib/hooks/use-outside-click/useOutsideClick';
import { getHeadline, showSearchInput, signOut } from './Dashboard.utils';
import { useAppDispatch, useAppSelector } from '../../../store/index.util';
import { removeAuthUser } from '../../../store/slice/auth/auth.slice';
import { useEscapeKey } from '../../../lib/hooks/use-escape-key/useEscapeKey';

type DashboardHeaderProps = {
  toggleDrawer: VoidFunction;
  toggleLogoutModal: VoidFunction;
};

export function DashboardHeader({
  toggleDrawer,
  toggleLogoutModal,
}: DashboardHeaderProps): React.JSX.Element {
  const { pathname } = useLocation();
  
  const [showMenu, setShowMenu] = useState(false);
  const [displaySearchInput, setDisplaySearchInput] = useState(false);

  useOutsideClick((): void => {
    setShowMenu(false);
    setDisplaySearchInput(false);
  });

  useEscapeKey((): void => {
    setShowMenu(false);
    setDisplaySearchInput(false);
  });

  const toggleMenu = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setShowMenu((prevState) => !prevState);
  };

  const toggleSearchOnMobileView = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    setDisplaySearchInput((prevState) => !prevState);
  };

  const headline = getHeadline(pathname);

  return (
    <header className="p-4 border-b border-b-gray-400 lg:border-b-gray-300 xl:px-6 sticky top-0 z-1">
      <Row className="items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="hover:cursor-pointer border border-gray-400 rounded-sm py-1 px-1.5 lg:hidden"
            onClick={toggleDrawer}
          >
            <Menu className="w-5" />
          </button>
          <Headline tag="h3">{headline}</Headline>
        </div>
        {showSearchInput(pathname) && (
          <SearchInput pathname={pathname} className='basis-4/12 hidden md:flex'/>
        )}
        <HeaderRight
          showMenu={showMenu}
          displaySearchInput={displaySearchInput}
          onToggleMenu={toggleMenu}
          onToggleLogoutModal={toggleLogoutModal}
          onToggleSearchOnMobileView={toggleSearchOnMobileView}
        >
          <SearchInput pathname={pathname} />
        </HeaderRight>
      </Row>
    </header>
  );
}

type HeaderRightProps = {
  showMenu: boolean;
  displaySearchInput: boolean;
  children: React.ReactNode;
  onToggleMenu: (event: MouseEvent<HTMLButtonElement>) => void;
  onToggleLogoutModal: VoidFunction;
  onToggleSearchOnMobileView: (event: MouseEvent<HTMLButtonElement>) => void;
};

function HeaderRight({
  showMenu,
  displaySearchInput,
  children,
  onToggleLogoutModal,
  onToggleSearchOnMobileView,
  onToggleMenu,
}: HeaderRightProps): React.JSX.Element {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="flex items-center gap-3 lg:gap-0">
      <div>
        <button
          onClick={onToggleSearchOnMobileView}
          className="flex items-center gap-1 md:hidden"
        >
          <Search width={20} height={20} />
        </button>
        <AnimatePresence>
          {displaySearchInput && (
            <motion.div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="fixed md:hidden top-24 left-1/2 -translate-1/2 w-[93%]"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative">
        <button onClick={onToggleMenu} className="flex items-center gap-1">
          <img
            src={`${import.meta.env.VITE_BASE_SERVER}/${user?.imagePath}`}
            alt={`${user?.name}'s profile`}
            className="w-8 h-8 rounded-full object-cover"
          />
          <ChevronDown width={16} height={16} />
        </button>
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="absolute bg-white shadow-md top-6 right-0 w-55 border border-gray-100 rounded-sm flex flex-col"
            >
              <Link
                to="/dashboard/account-settings?tab=personal"
                className="flex items-center gap-2 py-1 px-3 hover:bg-gray-100"
              >
                <Settings className="w-4" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={onToggleLogoutModal}
                className="flex items-center gap-2 py-1 px-3 hover:bg-gray-100 w-full hover:cursor-pointer"
              >
                <LogOut className="w-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


type SearchInputProps = {
  pathname: string;
  className?: string;
}

function SearchInput({pathname, className}: SearchInputProps): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const debounceRef = useRef<number>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!event.target.value) {
      navigate(pathname);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const configuredSearchParams = new URLSearchParams({
        q: event.target.value,
      }).toString();
      navigate(`${pathname}?${configuredSearchParams}`);
    }, 500);
  };

  const searchQuery = searchParams.get('q');

  return (
    <div className={`form-control rounded-2xl bg-white border border-gray-200 flex gap-2 items-center px-3 py-1 ${className ?? ''}`}>
      <Search width={16} height={16} className="text-gray-400" />
      <input
        type="search"
        autoFocus
        defaultValue={searchQuery ?? ''}
        placeholder="Search for anything ..."
        className="basis-full bg-white outline-none"
        onChange={handleChange}
      />
    </div>
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
