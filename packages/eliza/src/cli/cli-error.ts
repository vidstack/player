const ERROR_NAME = '@vidstack/eliza/cliError';

// Use this function instead of subclassing Error because of problems after transpilation.
export function buildCLIError(message: string): Error {
  const error = new Error(message);
  error.name = ERROR_NAME;
  return error;
}

export function isCLIError(error: unknown): error is Error {
  return (error as Error).name === ERROR_NAME;
}
