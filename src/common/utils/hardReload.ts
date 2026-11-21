export const cleanupReloadUrlParam = (): void => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (url.searchParams.has('_reload')) {
    url.searchParams.delete('_reload');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  }
};

export const clearCacheAndHardReload = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(async (reg) => {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          await reg.unregister();
        }),
      );
    } catch {
      return;
    }
  }

  if ('caches' in window) {
    try {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    } catch {
      return;
    }
  }

  try {
    sessionStorage.clear();
  } catch {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set('_reload', Date.now().toString());
  window.location.replace(url.toString());
};
