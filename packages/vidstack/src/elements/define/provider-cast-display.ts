import { effect } from 'maverick.js';
import chromecastIconPaths from 'media-icons/dist/icons/chromecast.js';

import type { MediaStore } from '../../core/api/player-state';
import { cloneTemplateContent, createTemplate } from '../../utils/dom';

const svgTemplate = /* #__PURE__*/ createTemplate(
  `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>`,
);

export function insertContent(container: HTMLElement, $state: MediaStore) {
  const icon = cloneTemplateContent<SVGElement>(svgTemplate);
  icon.innerHTML = chromecastIconPaths;
  container.append(icon);

  const text = document.createElement('span');
  text.classList.add('vds-google-cast-info');
  container.append(text);

  const deviceName = document.createElement('span');
  deviceName.classList.add('vds-google-cast-device-name');

  effect(() => {
    const { remotePlaybackInfo } = $state,
      info = remotePlaybackInfo();

    if (info?.deviceName) {
      deviceName.textContent = info.deviceName;
      text.append('Google Cast on ', deviceName);
    }

    return () => {
      text.textContent = '';
    };
  });
}
