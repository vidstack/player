import { createContext } from '@base/context/index.js';

export const controlsContext = {
  idle: createContext(false),
  hidden: createContext(false)
};
