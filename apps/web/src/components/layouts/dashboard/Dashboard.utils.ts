import { DASHBOARD_PATHS } from "../../organisms/side-drawer/SideDrawer.utils";

/**
 * Makes a request to signout of the application
 * @returns {void}
 */
export async function signOut(): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return response.json();
}

/**
 * Generates the headline
 * @param pathname - the current pathname in the url
 * @returns the right headline for the url path
 */
export function getHeadline(pathname: string): string {
  if (pathname === '/dashboard/account-settings')
    return 'Account Settings'

  let queryParamIndex = pathname.indexOf('?');
  if (queryParamIndex === -1) queryParamIndex = pathname.length;
  const pathnameWithoutParams = pathname.slice(0, queryParamIndex)
  return DASHBOARD_PATHS.find(item => item.path === pathnameWithoutParams)?.name ?? ''
}

export function showSearchInput(pathname: string): boolean {
  const preferredPathnameToShowSearchInput = DASHBOARD_PATHS.map(item => item.path);
  const indexForDashboardPath = preferredPathnameToShowSearchInput.indexOf('/dashboard');
  const deleteCount = 1;
  preferredPathnameToShowSearchInput.splice(indexForDashboardPath, deleteCount);

  return preferredPathnameToShowSearchInput.includes(pathname);
}