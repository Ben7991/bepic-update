import { StatusCodes } from './constants.utils';
import type {
  ResponseWithOnlyData,
  ServerErrorResponse,
  User,
} from './types.utils';

/**
 * Retrieve the access token from the cookie, if not found
 * return an empty string
 * @returns the access token or an empty string
 */
export function getAccessToken(): string {
  const cookies = document.cookie;
  const accessTokenCookie = cookies
    ?.split(';')
    ?.filter((cookie) => cookie.trim().startsWith('_acc-tk='))[0];

  if (!accessTokenCookie) {
    return '';
  }

  return decodeURIComponent(accessTokenCookie.split('=')[1] ?? '');
}

/**
 * Returns a configured HTTP Headers
 * @param {boolean|undefined} withAuth - should attach the authorization token
 * @returns an instance of the headers
 */
export function getHeaders(withAuth?: boolean): Headers {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (withAuth) {
    headers.append('authorization', `Bearer ${getAccessToken()}`);
  }

  return headers;
}

/**
 * Returns a boolean response, indicating either a successfully response or failure
 * @returns true, if it was successful, else false
 */
export async function refreshToken(): Promise<boolean> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/auth/refresh-token`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );

  if (response.status !== StatusCodes.SUCCESS) {
    return false;
  }

  return true;
}

/**
 * Returns the details of an
 * @returns authenticated user detaiils
 */
export async function getAuthUser(): Promise<User> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/auth/user`, {
    method: 'GET',
    headers: getHeaders(true),
    credentials: 'include',
  });
  const result: ResponseWithOnlyData<User> | ServerErrorResponse =
    await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await getAuthUser();
    }
    throw new Error((result as ServerErrorResponse).message);
  }

  return (result as ResponseWithOnlyData<User>).data;
}
