## Usage

The `<vds-toggle>` component is a foundational element used to build other toggle buttons such as
`<vds-play-button>`, `<vds-mute-button>`, etc.

<slot name="usage" />

```css
vds-toggle-button[pressed] .pressed {
  display: none;
}

vds-toggle-button:not([pressed]) .not-pressed {
  display: none;
}
```

## Custom Toggle Button

The example below shows how we built the `PlayButtonElement`. You can use it as a reference to
build your own custom toggle button element.

```ts:title=PlayButtonElement.ts:copy
import {
	mediaStoreSubscription,
	MediaRemoteControl,
	ToggleButtonElement
} from '@vidstack/player';

export class PlayButtonElement extends ToggleButtonElement {
	protected readonly _mediaRemote = new MediaRemoteControl(this);

	constructor() {
		super();
		mediaStoreSubscription(this, 'paused', ($paused) => {
			this.pressed = !$paused;
			this.setAttribute('media-paused', $paused ? '' : null);
		});
	}

	override connectedCallback(): void {
		super.connectedCallback();
		if (!this.hasAttribute('aria-label')) {
			this.setAttribute('aria-label', 'Play');
		}
	}

	protected override _handleButtonClick(event: Event) {
		if (this.disabled) return;

		if (this.pressed) {
			this._mediaRemote.pause(event);
		} else {
			this._mediaRemote.play(event);
		}
	}
}
```
