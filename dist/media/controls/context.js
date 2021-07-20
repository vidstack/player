import { createContext } from '../../foundation/context/index.js';
export const controlsContext = {
  idle: createContext(false),
  hidden: createContext(false)
};
