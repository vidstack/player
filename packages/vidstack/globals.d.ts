/// <reference path="./dom.d.ts" />
/// <reference types="maverick.js" />
/// <reference path="./index.d.ts" />

declare global {
  interface HTMLElementEventMap extends MaverickOnAttributes {}
}

export {};
