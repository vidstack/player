import {
	VdsEnterFullscreenRequestEvent,
	VdsExitFullscreenRequestEvent,
	VdsMuteRequestEvent,
	VdsPauseRequestEvent,
	VdsPlayRequestEvent,
	VdsSeekingRequestEvent,
	VdsSeekRequestEvent,
	VdsUnmuteRequestEvent,
	VdsVolumeChangeRequestEvent
} from './media-request.events.js';

export class MediaRemoteControl {
	/**
	 * @protected
	 * @readonly
	 * @type {Element}
	 */
	host;

	/**
	 * @param {Element} host
	 */
	constructor(host) {
		this.host = host;
	}

	/**
	 * @param {Event} [event]
	 * @returns {void}
	 */
	play(event) {
		this.host.dispatchEvent(
			new VdsPlayRequestEvent({
				originalEvent: event
			})
		);
	}

	/**
	 * @param {Event} [event]
	 * @returns {void}
	 */
	pause(event) {
		this.host.dispatchEvent(
			new VdsPauseRequestEvent({
				originalEvent: event
			})
		);
	}

	/**
	 * @param {Event} [event]
	 * @returns {void}
	 */
	mute(event) {
		this.host.dispatchEvent(
			new VdsMuteRequestEvent({
				originalEvent: event
			})
		);
	}

	/**
	 * @param {Event} [event]
	 * @returns {void}
	 */
	unmute(event) {
		this.host.dispatchEvent(
			new VdsUnmuteRequestEvent({
				originalEvent: event
			})
		);
	}

	/**
	 * @param {Event} [event]
	 * @returns {void}
	 */
	enterFullscreen(event) {
		this.host.dispatchEvent(
			new VdsEnterFullscreenRequestEvent({
				originalEvent: event
			})
		);
	}

	/**
	 * @param {Event} [event]
	 * @returns {void}
	 */
	exitFullscreen(event) {
		this.host.dispatchEvent(
			new VdsExitFullscreenRequestEvent({
				originalEvent: event
			})
		);
	}

	/**
	 * @param {number} time
	 * @param {Event} event
	 * @returns {void}
	 */
	seeking(time, event) {
		this.host.dispatchEvent(
			new VdsSeekingRequestEvent({
				detail: time,
				originalEvent: event
			})
		);
	}

	/**
	 * @param {number} time
	 * @param {Event} [event]
	 * @returns {void}
	 */
	seek(time, event) {
		this.host.dispatchEvent(
			new VdsSeekRequestEvent({
				detail: time,
				originalEvent: event
			})
		);
	}

	/**
	 * @param {number} volume
	 * @param {Event} [event]
	 * @returns {void}
	 */
	changeVolume(volume, event) {
		this.host.dispatchEvent(
			new VdsVolumeChangeRequestEvent({
				detail: volume,
				originalEvent: event
			})
		);
	}
}
