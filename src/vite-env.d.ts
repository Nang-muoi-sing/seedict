/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV_NAME?: string;
  readonly VITE_API_HOST?: string;
  readonly VITE_API_BASE_PATH?: string;
  readonly VITE_BASE_URL?: string;
  readonly VITE_OSS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
