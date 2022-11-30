/// <reference path="./dom.d.ts" />
/// <reference types="maverick.js" />
/// <reference path="./player.d.ts" />

declare global {
  interface HTMLElementEventMap extends MaverickOnAttributes {}
}

export {};
