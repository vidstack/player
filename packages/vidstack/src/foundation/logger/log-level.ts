export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';

export const LogLevelValue = Object.freeze({
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
});

export const LogLevelColor = Object.freeze({
  silent: 'white',
  error: 'hsl(6, 58%, 50%)',
  warn: 'hsl(51, 58%, 50%)',
  info: 'hsl(219, 58%, 50%)',
  debug: 'hsl(280, 58%, 50%)',
});
