import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Allow manual simulation of offline mode for testing
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mlh_simulate_offline') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulateOffline = () => {
    setIsSimulatedOffline(prev => {
      const next = !prev;
      try {
        localStorage.setItem('mlh_simulate_offline', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const effectiveOnline = isOnline && !isSimulatedOffline;

  return {
    isOnline: effectiveOnline,
    realIsOnline: isOnline,
    isSimulatedOffline,
    toggleSimulateOffline
  };
}
