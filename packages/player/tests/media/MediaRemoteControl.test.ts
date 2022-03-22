import { fixture } from '@open-wc/testing-helpers';
import { waitForEvent } from '@vidstack/foundation';
import { html, LitElement } from 'lit';

import { MediaRemoteControl } from '$lib';

class RemoteControlElement extends LitElement {
  control = new MediaRemoteControl(this);
}

window.customElements.define('remote-control', RemoteControlElement);

async function buildFixture() {
  const controller = await fixture(html`
    <!-- Dummy media controller. -->
    <div class="fake-media-controller">
      <!-- Filler to ensure requests are bubbling. -->
      <div>
        <remote-control></remote-control>
      </div>
    </div>
  `);

  const remoteControl = controller.querySelector('remote-control') as RemoteControlElement;

  return { controller, remoteControl };
}

it('should dispatch play request', async function () {
  const { controller, remoteControl } = await buildFixture();

  const triggerEvent = new MouseEvent('click');

  setTimeout(() => {
    remoteControl.control.play(triggerEvent);
  });

  const event = await waitForEvent(controller, 'vds-play-request');

  expect(event.triggerEvent).to.equal(triggerEvent);
});

it('should dispatch pause request', async function () {
  const { controller, remoteControl } = await buildFixture();

  const triggerEvent = new MouseEvent('click');

  setTimeout(() => {
    remoteControl.control.pause(triggerEvent);
  });

  const event = await waitForEvent(controller, 'vds-pause-request');

  expect(event.triggerEvent).to.equal(triggerEvent);
});

it('should dispatch mute request', async function () {
  const { controller, remoteControl } = await buildFixture();

  const triggerEvent = new MouseEvent('click');

  setTimeout(() => {
    remoteControl.control.mute(triggerEvent);
  });

  const event = await waitForEvent(controller, 'vds-mute-request');

  expect(event.triggerEvent).to.equal(triggerEvent);
});

it('should dispatch unmute request', async function () {
  const { controller, remoteControl } = await buildFixture();

  const triggerEvent = new MouseEvent('click');

  setTimeout(() => {
    remoteControl.control.unmute(triggerEvent);
  });

  const event = await waitForEvent(controller, 'vds-unmute-request');

  expect(event.triggerEvent).to.equal(triggerEvent);
});

it('should dispatch enter fullscreen request', async function () {
  const { controller, remoteControl } = await buildFixture();

  const triggerEvent = new MouseEvent('click');

  setTimeout(() => {
    remoteControl.control.enterFullscreen(undefined, triggerEvent);
  });

  const event = await waitForEvent(controller, 'vds-enter-fullscreen-request');

  expect(event.triggerEvent).to.equal(triggerEvent);
});

it('should dispatch exit fullscreen request', async function () {
  const { controller, remoteControl } = await buildFixture();

  const triggerEvent = new MouseEvent('click');

  setTimeout(() => {
    remoteControl.control.exitFullscreen(undefined, triggerEvent);
  });

  const event = await waitForEvent(controller, 'vds-exit-fullscreen-request');

  expect(event.triggerEvent).to.equal(triggerEvent);
});

it('should dispatch seeking request', async function () {
  const { controller, remoteControl } = await buildFixture();

  const triggerEvent = new MouseEvent('click');

  setTimeout(() => {
    remoteControl.control.seeking(50, triggerEvent);
  });

  const event = await waitForEvent(controller, 'vds-seeking-request');

  expect(event.detail).to.equal(50);
  expect(event.triggerEvent).to.equal(triggerEvent);
});

it('should dispatch seek request', async function () {
  const { controller, remoteControl } = await buildFixture();

  const triggerEvent = new MouseEvent('click');

  setTimeout(() => {
    remoteControl.control.seek(50, triggerEvent);
  });

  const event = await waitForEvent(controller, 'vds-seek-request');

  expect(event.detail).to.equal(50);
  expect(event.triggerEvent).to.equal(triggerEvent);
});

it('should dispatch volume change request', async function () {
  const { controller, remoteControl } = await buildFixture();

  const triggerEvent = new MouseEvent('click');

  setTimeout(() => {
    remoteControl.control.changeVolume(50, triggerEvent);
  });

  const event = await waitForEvent(controller, 'vds-volume-change-request');

  expect(event.detail).to.equal(50);
  expect(event.triggerEvent).to.equal(triggerEvent);
});
