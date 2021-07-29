import { createContext } from '../../base/context';

export const scrubberPreviewContext = {
  time: createContext(0),
  showing: createContext(false)
};
