import { createContext } from '@base/context/index';

export const scrubberPreviewContext = {
  time: createContext(0),
  showing: createContext(false)
};
