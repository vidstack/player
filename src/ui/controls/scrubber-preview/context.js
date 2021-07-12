import { createContext } from '../../../foundation/context/index.js';

export const scrubberPreviewContext = {
  time: createContext(0),
  showing: createContext(false)
};
