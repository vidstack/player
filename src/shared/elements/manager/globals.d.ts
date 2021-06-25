import { ElementManagerEvents } from './ElementManager.js';

declare global {
	interface GlobalEventHandlersEventMap extends ElementManagerEvents {}
}
