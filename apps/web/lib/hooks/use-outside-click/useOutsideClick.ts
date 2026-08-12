'use client';

import { useEffect } from 'react';

/**
 * Useful hook to setup click handles when a user
 * clicks away from the initial element
 * that toggles a menu
 * @param {VoidFunction} handleOutsideClick
 */
export function useOutsideClick(handleOutsideClick: VoidFunction) {
  useEffect(() => {
    if (typeof window !== 'object') {
      return;
    }

    window.addEventListener('click', handleOutsideClick);

    return () => window.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);
}
