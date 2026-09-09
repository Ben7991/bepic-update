'use client';

import { useState } from 'react';

export function useToggle() {
  const [show, setShow] = useState(false);

  const toggle = (): void => {
    setShow(state => !state);
  };

  return { show, toggle };
}
