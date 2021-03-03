import { PropertyValues } from 'lit-element';

import { MediaType } from '../../core';
import { VideoProvider } from '../video';

export class HlsProvider extends VideoProvider {
  // TODO: load lib

  firstUpdated(changedProps: PropertyValues): void {
    super.firstUpdated(changedProps);
    // TODO: attach to hlsjs
  }

  disconnectedCallback(): void {
    // TODO: disconnect
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  canPlayType(type: string): boolean {
    // TODO: HLS_EXT.test
    return super.canPlayType(type);
  }

  protected getMediaType(): MediaType {
    // TODO: can hlsjs tell us media type?
    return super.getMediaType();
  }
}
