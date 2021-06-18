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
} from './media-request.events';

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
	 * @param {Event} [originalEvent]
	 * @returns {void}
	 */
	play(originalEvent) {
		this.host.dispatchEvent(
			new VdsPlayRequestEvent({
				originalEvent
			})
		);
	}

	/**
	 * @param {Event} [originalEvent]
	 * @returns {void}
	 */
	pause(originalEvent) {
		this.host.dispatchEvent(
			new VdsPauseRequestEvent({
				originalEvent
			})
		);
	}

	/**
	 * @param {Event} [originalEvent]
	 * @returns {void}
	 */
	mute(originalEvent) {
		this.host.dispatchEvent(
			new VdsMuteRequestEvent({
				originalEvent
			})
		);
	}

	/**
	 * @param {Event} [originalEvent]
	 * @returns {void}
	 */
	unmute(originalEvent) {
		this.host.dispatchEvent(
			new VdsUnmuteRequestEvent({
				originalEvent
			})
		);
	}

	/**
	 * @param {Event} [originalEvent]
	 * @returns {void}
	 */
	enterFullscreen(originalEvent) {
		this.host.dispatchEvent(
			new VdsEnterFullscreenRequestEvent({
				originalEvent
			})
		);
	}

	/**
	 * @param {Event} [originalEvent]
	 * @returns {void}
	 */
	exitFullscreen(originalEvent) {
		this.host.dispatchEvent(
			new VdsExitFullscreenRequestEvent({
				originalEvent
			})
		);
	}

	/**
	 * @param {number} time
	 * @param {Event} originalEvent
	 * @returns {void}
	 */
	seeking(time, originalEvent) {
		this.host.dispatchEvent(
			new VdsSeekingRequestEvent({
				detail: time,
				originalEvent
			})
		);
	}

	/**
	 * @param {number} time
	 * @param {Event} [originalEvent]
	 * @returns {void}
	 */
	seek(time, originalEvent) {
		this.host.dispatchEvent(
			new VdsSeekRequestEvent({
				detail: time,
				originalEvent
			})
		);
	}

	/**
	 * @param {number} volume
	 * @param {Event} [originalEvent]
	 * @returns {void}
	 */
	changeVolume(volume, originalEvent) {
		this.host.dispatchEvent(
			new VdsVolumeChangeRequestEvent({
				detail: volume,
				originalEvent
			})
		);
	}
}
