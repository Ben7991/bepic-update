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
