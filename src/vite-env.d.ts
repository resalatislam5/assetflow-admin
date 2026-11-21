declare const __APP_VERSION__: string;
declare const __APP_BUILD_TIME__: string;

interface Window {
  __triggerAppUpdate?: () => void;
  __checkForAppUpdate?: () => Promise<boolean>;
}
