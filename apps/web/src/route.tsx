/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import Dashboard from './components/layouts/dashboard/Dashboard';

const LandingPage = lazy(() => import('./pages/landing-page/LandingPage'));

// dashboard
const Overview = lazy(() => import('./pages/dashboard/overview/Overview'));
const AccountSettings = lazy(
  () => import('./pages/dashboard/account-settings/AccountSettings'),
);
const Awards = lazy(() => import('./pages/dashboard/awards/Awards'));
const BonusWithdrawal = lazy(
  () => import('./pages/dashboard/bonus-withdrawal/BonusWithdrawal'),
);
const Distributors = lazy(
  () => import('./pages/dashboard/distributors/Distributors'),
);
const Incentives = lazy(
  () => import('./pages/dashboard/incentives/Incentives'),
);
const IncentivesWon = lazy(
  () => import('./pages/dashboard/incentives-won/IncentivesWon'),
);
const MyTree = lazy(() => import('./pages/dashboard/my-tree/MyTree'));
const OrderHistory = lazy(
  () => import('./pages/dashboard/order-history/OrderHistory'),
);
const Products = lazy(() => import('./pages/dashboard/products/Products'));
const PurchaseHistory = lazy(
  () => import('./pages/dashboard/purchase-history/PurchaseHistory'),
);
const RequestWithdrawal = lazy(
  () => import('./pages/dashboard/request-withdrawal/RequestWithdrawal'),
);
const Transactions = lazy(
  () => import('./pages/dashboard/transactions/Transactions'),
);

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'account-settings', element: <AccountSettings /> },
      { path: 'awards', element: <Awards /> },
      { path: 'bonus-withdrawal', element: <BonusWithdrawal /> },
      { path: 'distributors', element: <Distributors /> },
      { path: 'incentives', element: <Incentives /> },
      { path: 'incentives-won', element: <IncentivesWon /> },
      { path: 'my-tree', element: <MyTree /> },
      { path: 'order-history', element: <OrderHistory /> },
      { path: 'products', element: <Products /> },
      { path: 'purchase-history', element: <PurchaseHistory /> },
      { path: 'request-withdrawal', element: <RequestWithdrawal /> },
      { path: 'transactions', element: <Transactions /> },
    ],
  },
]);
