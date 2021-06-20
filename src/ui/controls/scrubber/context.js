import { createContext } from '../../../shared/context';

export const scrubberContext = {
	preview: {
		time: createContext(0),
		showing: createContext(false)
	}
};
