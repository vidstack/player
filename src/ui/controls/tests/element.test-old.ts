import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { stub } from 'sinon';

import { ViewType } from '../../../media';
import { buildMediaPlayerFixture } from '../../../media/test-utils';
import { CONTROLS_ELEMENT_TAG_NAME, ControlsElement } from '../ControlsElement';

window.customElements.define(CONTROLS_ELEMENT_TAG_NAME, ControlsElement);

describe(CONTROLS_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <vds-controls>
        <div class="slot"></div>
      </vds-controls>
    `);

    const controls = player.querySelector(CONTROLS_ELEMENT_TAG_NAME)!;

    return { player, controls };
  }

  test('it should render DOM correctly', async function () {
    const { controls } = await buildFixture();
    expect(controls).dom.to.equal(`
      <vds-controls
        hidden
        media-paused
        media-view-type="unknown"
      >
        <div class="slot"></div>
      </vds-controls>
    `);
  });

  test('it should render shadow DOM correctly', async function () {
    const { controls } = await buildFixture();
    expect(controls).shadowDom.to.equal(`<slot></slot>`);
  });

  test('it should toggle `hidden` attribute', async function () {
    const { player, controls } = await buildFixture();
    await player.controlsManager.hide();
    expect(controls).to.have.attribute('hidden');
    await player.controlsManager.show();
    expect(controls).to.not.have.attribute('hidden');
  });

  test('it should toggle `idle` attribute', async function () {
    const { player, controls } = await buildFixture();
    player.idleManager.timeout = 0;
    player.idleManager.start();
    await oneEvent(player, 'vds-idle-change');
    expect(controls).to.have.attribute('idle');
    await player.idleManager.stop();
    await elementUpdated(controls);
    expect(controls).to.not.have.attribute('idle');
  });

  test('it should set `media-autoplay-error` attribute', async function () {
    const { player, controls } = await buildFixture();

    player.autoplay = true;

    stub(player, 'play').throws(() => {
      throw Error('Play failed.');
    });

    await player.forceMediaReady();
    await elementUpdated(controls);

    expect(player.autoplayError?.message).to.equal('Play failed.');

    expect(controls).to.have.attribute('media-autoplay-error');
  });

  test('it should toggle `media-can-play` attribute', async function () {
    const { player, controls } = await buildFixture();
    await player.forceMediaReady();
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-can-play');
    player.ctx.canPlay = false;
    await elementUpdated(controls);
    expect(controls).to.not.have.attribute('media-can-play');
  });

  test('it should toggle `media-paused` attribute', async function () {
    const { player, controls } = await buildFixture();
    await player.forceMediaReady();
    player.play();
    await elementUpdated(controls);
    expect(controls).to.not.have.attribute('media-paused');
    player.pause();
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-paused');
    player.play();
    await elementUpdated(controls);
    expect(controls).to.not.have.attribute('media-paused');
  });

  test('it should toggle `media-view-type` attribute', async function () {
    const { player, controls } = await buildFixture();
    player.ctx.viewType = ViewType.Audio;
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-view-type', ViewType.Audio);
    player.ctx.viewType = ViewType.Video;
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-view-type', ViewType.Video);
    player.ctx.viewType = ViewType.Unknown;
    await elementUpdated(controls);
    expect(controls).to.have.attribute('media-view-type', ViewType.Unknown);
  });
});
