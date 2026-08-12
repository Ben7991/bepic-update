import {
  BanknoteArrowDown,
  BanknoteCheck,
  ChartColumnIncreasing,
  CircleQuestionMark,
  ClockFading,
  Gift,
  Network,
  Pill,
  Trophy,
  UsersRound,
} from 'lucide-react';

/**
 * Returns the active classnames for a provided link
 * @param {string} currentPathname - The current path name of active path
 * @param {string} preferredPathname - The desired path to match to
 * @returns the active classnames or an empty string
 */
export const getActiveLinkClassnames = (
  currentPathname: string,
  preferredPathname: string,
): string => {
  if (currentPathname === preferredPathname) {
    return 'bg-blue-600 text-white';
  }
  return 'hover:bg-gray-300';
};

export const DASHBOARD_PATHS: Array<{
  path: string;
  name: string;
  icon: React.JSX.Element;
}> = [
  { path: '/dashboard', name: 'Dashboard', icon: <ChartColumnIncreasing /> },
  { path: '/dashboard/incentives', name: 'Incentives', icon: <Gift /> },
  { path: '/dashboard/products', name: 'Products', icon: <Pill /> },
  {
    path: '/dashboard/order-history',
    name: 'Order History',
    icon: <ClockFading />,
  },
  {
    path: '/dashboard/purchase-history',
    name: 'Purchase History',
    icon: <ClockFading />,
  },
  { path: '/dashboard/my-tree', name: 'My Tree', icon: <Network /> },
  { path: '/dashboard/awards', name: 'Awards', icon: <Trophy /> },
  {
    path: '/dashboard/incentives-won',
    name: 'Incentives Won',
    icon: <Trophy />,
  },
  {
    path: '/dashboard/request-withdrawal',
    name: 'Request Withdrawal',
    icon: <CircleQuestionMark />,
  },
  {
    path: '/dashboard/bonus-withdrawal',
    name: 'Bonus Withdrawal',
    icon: <BanknoteArrowDown />,
  },
  {
    path: '/dashboard/transactions',
    name: 'Transactions',
    icon: <BanknoteCheck />,
  },
  {
    path: '/dashboard/distributors',
    name: 'Distributors',
    icon: <UsersRound />,
  },
] as const;

export function isMobileView(deviceWidth: number = 425): boolean {
  if (typeof window !== 'object') {
    return false;
  }

  return window.innerWidth <= deviceWidth;
}
