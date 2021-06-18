/* c8 ignore next 1000 */

import {
	CanPlay,
	MediaProviderElement,
	VdsPauseEvent,
	VdsPlayEvent,
	VdsTimeUpdateEvent,
	VdsVolumeChangeEvent
} from '../..';

export const VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME =
	'vds-fake-media-provider';

/**
 * A fake media provider that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the provider in the desired state.
 */
export class FakeMediaProviderElement extends MediaProviderElement {
	connectedCallback() {
		super.connectedCallback();
		if (this.canPlay) this.handleMediaReady();
	}

	// -------------------------------------------------------------------------------------------
	// Provider Metods
	// -------------------------------------------------------------------------------------------

	getCurrentTime() {
		return this.context.currentTime;
	}

	setCurrentTime(time) {
		this.context.currentTime = time;
		this.dispatchEvent(new VdsTimeUpdateEvent({ detail: time }));
	}

	getMuted() {
		return this.context.muted;
	}

	setMuted(muted) {
		this.context.muted = muted;
		this.dispatchEvent(
			new VdsVolumeChangeEvent({
				detail: {
					volume: this.context.volume,
					muted
				}
			})
		);
	}

	getPaused() {
		return this.context.paused;
	}

	getVolume() {
		return this.context.volume;
	}

	setVolume(volume) {
		this.context.volume = volume;
		this.dispatchEvent(
			new VdsVolumeChangeEvent({
				detail: {
					volume,
					muted: this.context.muted
				}
			})
		);
	}

	// -------------------------------------------------------------------------------------------
	// Readonly Properties
	// -------------------------------------------------------------------------------------------

	get engine() {
		return undefined;
	}

	// -------------------------------------------------------------------------------------------
	// Playback
	// -------------------------------------------------------------------------------------------

	canPlayType() {
		return CanPlay.No;
	}

	async play() {
		this.context.paused = false;
		this.dispatchEvent(new VdsPlayEvent());
	}

	async pause() {
		this.context.paused = true;
		this.dispatchEvent(new VdsPauseEvent());
	}

	// -------------------------------------------------------------------------------------------
	// Fullscreen
	// -------------------------------------------------------------------------------------------

	async requestFullscreen() {
		this.context.fullscreen = true;
	}

	async exitFullscreen() {
		this.context.fullscreen = false;
	}
}
