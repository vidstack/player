import { createContext } from '../../../shared/context/index.js';

export const scrubberContext = {
	preview: {
		time: createContext(0),
		showing: createContext(false)
	}
};
