import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cleanupReloadUrlParam,
  clearCacheAndHardReload,
} from '../utils/hardReload';

export interface UseAppUpdateReturn {
  hasUpdate: boolean;
  latestVersion: string | null;
  isChecking: boolean;
  isDismissed: boolean;
  checkForUpdate: () => Promise<boolean>;
  applyUpdate: () => Promise<void>;
  dismissUpdate: () => void;
  restorePrompt: () => void;
}

export const useAppUpdate = (): UseAppUpdateReturn => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const hasUpdateRef = useRef(false);

  useEffect(() => {
    hasUpdateRef.current = hasUpdate;
  }, [hasUpdate]);

  const checkForUpdate = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const response = await fetch(`/version.json?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (!response.ok) {
        setIsChecking(false);
        return false;
      }

      const data = (await response.json()) as {
        version?: string;
        buildTime?: string;
      };

      if (data?.version) {
        setLatestVersion(data.version);
        const currentVersion =
          typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '';

        if (currentVersion && data.version !== currentVersion) {
          setHasUpdate(true);
          setIsChecking(false);
          return true;
        }
      }

      setIsChecking(false);
      return false;
    } catch {
      setIsChecking(false);
      return false;
    }
  }, []);

  const dismissUpdate = useCallback(() => {
    setIsDismissed(true);
  }, []);

  const restorePrompt = useCallback(() => {
    setIsDismissed(false);
  }, []);

  const applyUpdate = useCallback(async () => {
    await clearCacheAndHardReload();
  }, []);

  useEffect(() => {
    cleanupReloadUrlParam();

    const immediateTimeout = setTimeout(() => {
      checkForUpdate();
    }, 0);

    const delayedTimeout = setTimeout(() => {
      checkForUpdate();
    }, 2000);

    const pollingInterval = setInterval(() => {
      checkForUpdate();
    }, 25000);

    const handleActivity = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate();
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then((reg) => {
            reg?.update();
          });
        }
      }
    };

    window.addEventListener('focus', handleActivity);
    document.addEventListener('visibilitychange', handleActivity);

    const handlePreloadError = () => {
      setHasUpdate(true);
      checkForUpdate();
    };
    window.addEventListener('vite:preloadError', handlePreloadError);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;

        if (reg.waiting) {
          setHasUpdate(true);
        }

        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setHasUpdate(true);
            }
          });
        });
      });
    }

    if (typeof window !== 'undefined') {
      window.__triggerAppUpdate = () => {
        setHasUpdate(true);
      };
      window.__checkForAppUpdate = () => checkForUpdate();
    }

    return () => {
      clearTimeout(immediateTimeout);
      clearTimeout(delayedTimeout);
      clearInterval(pollingInterval);
      window.removeEventListener('focus', handleActivity);
      document.removeEventListener('visibilitychange', handleActivity);
      window.removeEventListener('vite:preloadError', handlePreloadError);

      if (typeof window !== 'undefined') {
        delete window.__triggerAppUpdate;
        delete window.__checkForAppUpdate;
      }
    };
  }, [checkForUpdate]);

  return {
    hasUpdate,
    latestVersion,
    isChecking,
    isDismissed,
    checkForUpdate,
    applyUpdate,
    dismissUpdate,
    restorePrompt,
  };
};
