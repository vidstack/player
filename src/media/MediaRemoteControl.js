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
	 * @returns {void}
	 */
	play() {
		this.host.dispatchEvent(new VdsPlayRequestEvent());
	}

	/**
	 * @returns {void}
	 */
	pause() {
		this.host.dispatchEvent(new VdsPauseRequestEvent());
	}

	/**
	 * @returns {void}
	 */
	mute() {
		this.host.dispatchEvent(new VdsMuteRequestEvent());
	}

	/**
	 * @returns {void}
	 */
	unmute() {
		this.host.dispatchEvent(new VdsUnmuteRequestEvent());
	}

	/**
	 * @returns {void}
	 */
	enterFullscreen() {
		this.host.dispatchEvent(new VdsEnterFullscreenRequestEvent());
	}

	/**
	 * @returns {void}
	 */
	exitFullscreen() {
		this.host.dispatchEvent(new VdsExitFullscreenRequestEvent());
	}

	/**
	 * @param {number} time
	 * @returns {void}
	 */
	seeking(time) {
		this.host.dispatchEvent(
			new VdsSeekingRequestEvent({
				detail: time
			})
		);
	}

	/**
	 * @param {number} time
	 * @returns {void}
	 */
	seek(time) {
		this.host.dispatchEvent(
			new VdsSeekRequestEvent({
				detail: time
			})
		);
	}

	/**
	 * @param {number} volume
	 * @returns {void}
	 */
	changeVolume(volume) {
		this.host.dispatchEvent(
			new VdsVolumeChangeRequestEvent({
				detail: volume
			})
		);
	}
}
