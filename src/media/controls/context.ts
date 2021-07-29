import { createContext } from '../../base/context';

export const controlsContext = {
  idle: createContext(false),
  hidden: createContext(false)
};
