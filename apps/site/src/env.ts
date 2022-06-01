export const env = Object.freeze({
  server: import.meta.env.SSR,
  browser: !import.meta.env.SSR,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
});
