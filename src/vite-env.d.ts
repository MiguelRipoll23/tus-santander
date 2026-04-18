/// <reference types="vite/client" />
/// <reference types="google.maps" />

interface ImportMetaEnv {
  readonly VITE_APP_GOOGLE_MAPS_KEY?: string;
  readonly VITE_APP_API_HOST: string;
  readonly VITE_APP_TELEMETRY_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module "*.png" {
  const src: string;
  export default src;
}

// Augment csstype to allow CSS custom properties (--*) in React style props
declare module "csstype" {
  interface Properties {
    [key: `--${string}`]: string | number | undefined;
  }
}

declare const gtag:
  | ((
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void)
  | undefined;
