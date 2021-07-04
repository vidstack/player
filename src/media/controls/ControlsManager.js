export class ControlsManager {
  //
}

// /**
//  * @protected
//  * @type {import('../controls').Controls | undefined}
//  */
// _controlsManager;

// /**
//  * Current component responsible for showing and hiding controls. This getter will fallback
//  * to the current media provider if no manager has connected.
//  *
//  * @type {import('../controls').Controls | undefined}
//  */
// get controlsManager() {
//   return this._controlsManager ?? this.mediaProvider;
// }

// /**
//  * Indicates whether a user interface should be shown for controlling the current media.
//  *
//  * @type {boolean}
//  */
// get controls() {
//   return this.context.controls;
// }

// set controls(isShowing) {
//   this.context.controls = isShowing;
//   if (!isNil(this.controlsManager)) {
//     this.controlsManager.controls = isShowing;
//   }
// }

// /**
//  * @protected
//  * @param {ControlsManagerConnectEvent} event
//  * @returns {void}
//  */
// handleControlsManagerConnect(event) {
//   event.stopPropagation();
//   // Hide previous manager controls.
//   if (!isNil(this.controlsManager)) this.controlsManager.controls = false;
//   const { manager, onDisconnect } = event.detail;
//   manager.controls = this.controls;
//   this._controlsManager = manager;
//   onDisconnect(() => {
//     this._controlsManager = undefined;
//   });
// }
