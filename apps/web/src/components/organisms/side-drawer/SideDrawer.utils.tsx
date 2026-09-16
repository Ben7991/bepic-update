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
    return 'text-blue-600 bg-blue-200';
  }
  return 'hover:bg-gray-200';
};

export const DASHBOARD_PATHS: Array<{
  path: string;
  name: string;
  icon: React.JSX.Element;
}> = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: <ChartColumnIncreasing className="w-4" />,
  },
  {
    path: '/dashboard/incentives',
    name: 'Incentives',
    icon: <Gift className="w-4" />,
  },
  {
    path: '/dashboard/products',
    name: 'Products',
    icon: <Pill className="w-4" />,
  },
  {
    path: '/dashboard/order-history',
    name: 'Order History',
    icon: <ClockFading className="w-4" />,
  },
  {
    path: '/dashboard/purchase-history',
    name: 'Purchase History',
    icon: <ClockFading className="w-4" />,
  },
  {
    path: '/dashboard/my-tree',
    name: 'My Tree',
    icon: <Network className="w-4" />,
  },
  {
    path: '/dashboard/awards',
    name: 'Awards',
    icon: <Trophy className="w-4" />,
  },
  {
    path: '/dashboard/incentives-won',
    name: 'Incentives Won',
    icon: <Trophy className="w-4" />,
  },
  {
    path: '/dashboard/request-withdrawal',
    name: 'Request Withdrawal',
    icon: <CircleQuestionMark className="w-4" />,
  },
  {
    path: '/dashboard/bonus-withdrawal',
    name: 'Bonus Withdrawal',
    icon: <BanknoteArrowDown className="w-4" />,
  },
  {
    path: '/dashboard/transactions',
    name: 'Transactions',
    icon: <BanknoteCheck className="w-4" />,
  },
  {
    path: '/dashboard/distributors',
    name: 'Distributors',
    icon: <UsersRound className="w-4" />,
  },
] as const;

export function isMobileView(deviceWidth: number = 425): boolean {
  if (typeof window !== 'object') {
    return false;
  }

  return window.innerWidth <= deviceWidth;
}
