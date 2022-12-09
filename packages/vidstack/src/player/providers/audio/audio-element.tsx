import { defineCustomElement, onConnect } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

import { htmlMediaElementPropDefs } from '../html/props';
import type { HtmlMediaProviderElement } from '../html/types';
import { useHtmlMediaElement } from '../html/use-provider';

export const AudioElementDefinition = defineCustomElement<AudioElement>({
  tagName: 'vds-audio',
  props: htmlMediaElementPropDefs,
  setup({ host, props, accessors }) {
    const $target = () => (host.$connected ? host.el : null);
    const { members } = useHtmlMediaElement($target, props);

    onConnect(() => {
      dispatchEvent(host.el, 'vds-view-type-change', { detail: 'audio' });
    });

    return mergeProperties(accessors(), members);
  },
});

/**
 * The `<vds-audio>` element adapts the underlying `<audio>` element to satisfy the media provider
 * contract, which generally involves providing a consistent API for loading, managing, and
 * tracking media state.
 *
 * @tagname vds-audio
 * @slot - Used to pass in the `<audio>` element.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}
 * @example
 * ```html
 * <vds-audio>
 *   <audio
 *     controls
 *     preload="none"
 *     src="https://media-files.vidstack.io/audio.mp3"
 *    ></audio>
 * </vds-audio>
 * ```
 * @example
 * ```html
 * <vds-audio>
 *   <audio controls preload="none">
 *     <source src="https://media-files.vidstack.io/audio.mp3" type="audio/mp3" />
 *   </audio>
 * </vds-audio>
 * ```
 */
export interface AudioElement extends HtmlMediaProviderElement {}
