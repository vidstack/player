import '../../../define/vds-media-controller';
import '../../../define/vds-fake-media-provider';

import { fixture, html } from '@open-wc/testing-helpers';

import { waitForEvent } from '../../../global/tests/utils';
import { isFunction } from '../../../utils/unit';
import { MediaRemoteControl } from '../../interact';
import {
  type MediaControllerConnectEvent,
  MediaControllerElement
} from '../MediaControllerElement';

async function buildFixture() {
  const controller = await fixture<MediaControllerElement>(`
    <vds-media-controller>
      <vds-fake-media-provider></vds-fake-media-provider>
    </vds-media-controller>
  `);

  const provider = controller.querySelector('vds-fake-media-provider')!;

  return { controller, provider };
}

test('light DOM snapshot', async () => {
  const { controller } = await buildFixture();
  expect(controller).dom.to.equal(`
    <vds-media-controller>
      <vds-fake-media-provider></vds-fake-media-provider>
    </vds-media-controller>
  `);
});

test('shadow DOM snapshot', async () => {
  const { controller } = await buildFixture();
  expect(controller).shadowDom.to.equal(`<slot></slot>`);
});

test('it should dispatch discovery event', async () => {
  const controller = document.createElement('vds-media-controller');

  setTimeout(() => {
    window.document.body.append(controller);
  });

  const { detail } = (await waitForEvent(
    document,
    'vds-media-controller-connect'
  )) as MediaControllerConnectEvent;

  expect(detail.element).to.be.instanceOf(MediaControllerElement);
  expect(isFunction(detail.onDisconnect)).to.be.true;
});

describe('media provider', () => {
  it.only('should connect/disconnect', async function () {
    const controller = await fixture<MediaControllerElement>(
      html`<vds-media-controller></vds-media-controller>`
    );

    const provider = document.createElement('vds-fake-media-provider');

    controller.append(provider);
    // TODO: something wrong with JSDOM here?
    // expect(controller.controller.mediaProvider === provider).to.be.true;

    provider.remove();
    expect(controller.controller.mediaProvider).to.be.undefined;
  });
});

describe('media requests', () => {
  test('it should handle mute/unmute requests', async function () {
    const { provider } = await buildFixture();
    const setMutedSpy = vi.spyOn(provider, 'muted', 'set');
    const remote = new MediaRemoteControl(provider);

    expect(setMutedSpy).not.toHaveBeenCalled();

    remote.mute();
    expect(setMutedSpy).to.toHaveBeenCalledWith(true);

    remote.unmute();
    expect(setMutedSpy).to.toHaveBeenCalledWith(false);
  });

  test('it should handle play/pause requests', async function () {
    const { provider } = await buildFixture();
    const pausedSpy = vi.spyOn(provider, 'paused', 'set');
    const remote = new MediaRemoteControl(provider);

    expect(pausedSpy).not.toHaveBeenCalled();

    remote.pause();
    expect(pausedSpy).to.toHaveBeenCalledWith(false);

    remote.play();
    expect(pausedSpy).to.toHaveBeenCalledWith(true);
  });

  test('it should handle seeking/seek requests', async function () {
    const { provider } = await buildFixture();
    const currentTimeSpy = vi.spyOn(provider, 'currentTime', 'set');
    const remote = new MediaRemoteControl(provider);

    expect(currentTimeSpy).not.toHaveBeenCalled();

    remote.seeking(100);
    expect(currentTimeSpy).to.toHaveBeenCalledWith(100);

    remote.seek(200);
    expect(currentTimeSpy).to.toHaveBeenCalledWith(200);
  });

  test('it should handle volume change request', async function () {
    const { provider } = await buildFixture();
    const volumeSpy = vi.spyOn(provider, 'volume', 'set');
    const remote = new MediaRemoteControl(provider);

    expect(volumeSpy).not.toHaveBeenCalled();

    remote.changeVolume(100);
    expect(volumeSpy).to.toHaveBeenCalledWith(1);
  });

  test('it should handle enter/exit fullscreen requests', async function () {
    const { provider } = await buildFixture();

    const requestFullscreenSpy = vi.spyOn(provider, 'requestFullscreen');
    const exitFullscreenSpy = vi.spyOn(provider, 'exitFullscreen');

    const remote = new MediaRemoteControl(provider);

    expect(requestFullscreenSpy).not.toHaveBeenCalled();
    expect(exitFullscreenSpy).not.toHaveBeenCalled();

    remote.enterFullscreen();
    expect(requestFullscreenSpy).to.toHaveBeenCalledWith(1);

    remote.exitFullscreen();
    expect(exitFullscreenSpy).to.toHaveBeenCalledWith(1);
  });
});
