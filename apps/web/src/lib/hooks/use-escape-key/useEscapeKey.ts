import { useCallback, useEffect, type KeyboardEvent } from 'react';

export function useEscapeKey(onHide: VoidFunction): void {
  const handleEvent = useCallback((event: KeyboardEvent|globalThis.KeyboardEvent): void => {
    if (event.key === "Escape") {
      onHide();
    }
  }, [onHide]);

  useEffect(() => {
    window.addEventListener('keydown', handleEvent);

    return () => window.removeEventListener('keydown', handleEvent);
  }, [handleEvent]);
}
