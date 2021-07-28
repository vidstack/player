import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent,
  MuteRequestEvent,
  PauseRequestEvent,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent,
  UnmuteRequestEvent,
  VolumeChangeRequestEvent
} from '@media/request.events';
import { expect, fixture, oneEvent } from '@open-wc/testing';
import { html, LitElement } from 'lit';

import { MediaRemoteControl } from '../MediaRemoteControl';

class ReferenceElement extends LitElement {
  remoteControl = new MediaRemoteControl(this);
}

window.customElements.define('ref-element', ReferenceElement);

describe(MediaRemoteControl.name, function () {
  async function buildFixture() {
    const controller = await fixture(html`
      <!-- Dummy media controller. -->
      <div class="fake-media-controller">
        <!-- Filler to ensure requests bubble. -->
        <div>
          <ref-element></ref-element>
        </div>
      </div>
    `);

    const ref = controller.querySelector('ref-element') as ReferenceElement;

    return { controller, ref };
  }

  it('should dispatch play request', async function () {
    const { controller, ref } = await buildFixture();

    const originalEvent = new MouseEvent('click');

    setTimeout(() => {
      ref.remoteControl.play(originalEvent);
    });

    const event = (await oneEvent(
      controller,
      'vds-play-request'
    )) as PlayRequestEvent;

    expect(event.originalEvent).to.equal(originalEvent);
  });

  it('should dispatch pause request', async function () {
    const { controller, ref } = await buildFixture();

    const originalEvent = new MouseEvent('click');

    setTimeout(() => {
      ref.remoteControl.pause(originalEvent);
    });

    const event = (await oneEvent(
      controller,
      'vds-pause-request'
    )) as PauseRequestEvent;

    expect(event.originalEvent).to.equal(originalEvent);
  });

  it('should dispatch mute request', async function () {
    const { controller, ref } = await buildFixture();

    const originalEvent = new MouseEvent('click');

    setTimeout(() => {
      ref.remoteControl.mute(originalEvent);
    });

    const event = (await oneEvent(
      controller,
      'vds-mute-request'
    )) as MuteRequestEvent;

    expect(event.originalEvent).to.equal(originalEvent);
  });

  it('should dispatch unmute request', async function () {
    const { controller, ref } = await buildFixture();

    const originalEvent = new MouseEvent('click');

    setTimeout(() => {
      ref.remoteControl.unmute(originalEvent);
    });

    const event = (await oneEvent(
      controller,
      'vds-unmute-request'
    )) as UnmuteRequestEvent;

    expect(event.originalEvent).to.equal(originalEvent);
  });

  it('should dispatch enter fullscreen request', async function () {
    const { controller, ref } = await buildFixture();

    const originalEvent = new MouseEvent('click');

    setTimeout(() => {
      ref.remoteControl.enterFullscreen(originalEvent);
    });

    const event = (await oneEvent(
      controller,
      'vds-enter-fullscreen-request'
    )) as EnterFullscreenRequestEvent;

    expect(event.originalEvent).to.equal(originalEvent);
  });

  it('should dispatch exit fullscreen request', async function () {
    const { controller, ref } = await buildFixture();

    const originalEvent = new MouseEvent('click');

    setTimeout(() => {
      ref.remoteControl.exitFullscreen(originalEvent);
    });

    const event = (await oneEvent(
      controller,
      'vds-exit-fullscreen-request'
    )) as ExitFullscreenRequestEvent;

    expect(event.originalEvent).to.equal(originalEvent);
  });

  it('should dispatch seeking request', async function () {
    const { controller, ref } = await buildFixture();

    const originalEvent = new MouseEvent('click');

    setTimeout(() => {
      ref.remoteControl.seeking(50, originalEvent);
    });

    const event = (await oneEvent(
      controller,
      'vds-seeking-request'
    )) as SeekingRequestEvent;

    expect(event.detail).to.equal(50);
    expect(event.originalEvent).to.equal(originalEvent);
  });

  it('should dispatch seek request', async function () {
    const { controller, ref } = await buildFixture();

    const originalEvent = new MouseEvent('click');

    setTimeout(() => {
      ref.remoteControl.seek(50, originalEvent);
    });

    const event = (await oneEvent(
      controller,
      'vds-seek-request'
    )) as SeekRequestEvent;

    expect(event.detail).to.equal(50);
    expect(event.originalEvent).to.equal(originalEvent);
  });

  it('should dispatch volume change request', async function () {
    const { controller, ref } = await buildFixture();

    const originalEvent = new MouseEvent('click');

    setTimeout(() => {
      ref.remoteControl.changeVolume(50, originalEvent);
    });

    const event = (await oneEvent(
      controller,
      'vds-volume-change-request'
    )) as VolumeChangeRequestEvent;

    expect(event.detail).to.equal(50);
    expect(event.originalEvent).to.equal(originalEvent);
  });
});
