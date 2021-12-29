import { createContext } from '../../base/context';

export const scrubberPreviewContext = createContext(() => ({
  time: 0,
  showing: false
}));
