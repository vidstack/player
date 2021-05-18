import { VdsCustomEvent } from '../../shared/events';

export class VdsMediaRequestEvent extends VdsCustomEvent {}

export class VdsMuteRequestEvent extends VdsMediaRequestEvent {
	static TYPE = 'vds-mute-request';
	constructor(eventInit) {
		super(VdsMuteRequestEvent.TYPE, {
			bubbles: true,
			composed: true,
			...(eventInit ?? {})
		});
	}
}

export class VdsUnmuteRequestEvent extends VdsMediaRequestEvent {
	static TYPE = 'vds-unmute-request';
	constructor(eventInit) {
		super(VdsUnmuteRequestEvent.TYPE, {
			bubbles: true,
			composed: true,
			...(eventInit ?? {})
		});
	}
}

export class VdsEnterFullscreenRequestEvent extends VdsMediaRequestEvent {
	static TYPE = 'vds-enter-fullscreen-request';
	constructor(eventInit) {
		super(VdsEnterFullscreenRequestEvent.TYPE, {
			bubbles: true,
			composed: true,
			...(eventInit ?? {})
		});
	}
}

export class VdsExitFullscreenRequestEvent extends VdsMediaRequestEvent {
	static TYPE = 'vds-exit-fullscreen-request';
	constructor(eventInit) {
		super(VdsExitFullscreenRequestEvent.TYPE, {
			bubbles: true,
			composed: true,
			...(eventInit ?? {})
		});
	}
}

export class VdsPlayRequestEvent extends VdsMediaRequestEvent {
	static TYPE = 'vds-play-request';
	constructor(eventInit) {
		super(VdsPlayRequestEvent.TYPE, {
			bubbles: true,
			composed: true,
			...(eventInit ?? {})
		});
	}
}

export class VdsPauseRequestEvent extends VdsMediaRequestEvent {
	static TYPE = 'vds-pause-request';
	constructor(eventInit) {
		super(VdsPauseRequestEvent.TYPE, {
			bubbles: true,
			composed: true,
			...(eventInit ?? {})
		});
	}
}

export class VdsSeekRequestEvent extends VdsMediaRequestEvent {
	static TYPE = 'vds-seek-request';
	constructor(eventInit) {
		super(VdsSeekRequestEvent.TYPE, {
			bubbles: true,
			composed: true,
			...(eventInit ?? {})
		});
	}
}

export class VdsSeekingRequestEvent extends VdsMediaRequestEvent {
	static TYPE = 'vds-seeking-request';
	constructor(eventInit) {
		super(VdsSeekingRequestEvent.TYPE, {
			bubbles: true,
			composed: true,
			...(eventInit ?? {})
		});
	}
}

export class VdsVolumeChangeRequestEvent extends VdsMediaRequestEvent {
	static TYPE = 'vds-volume-change-request';
	constructor(eventInit) {
		super(VdsVolumeChangeRequestEvent.TYPE, {
			bubbles: true,
			composed: true,
			...(eventInit ?? {})
		});
	}
}
