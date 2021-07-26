import { createContext } from '@base/context/index';

export const controlsContext = {
  idle: createContext(false),
  hidden: createContext(false)
};
