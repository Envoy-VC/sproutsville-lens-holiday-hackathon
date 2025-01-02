/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID: string;
  readonly VITE_POSTGRES_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
