import { createContext } from '../../../foundation/context/index.js';

export const scrubberContext = {
  preview: {
    time: createContext(0),
    showing: createContext(false)
  }
};
