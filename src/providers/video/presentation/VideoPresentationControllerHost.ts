import { LitElement } from 'lit';

export interface VideoPresentationControllerHost extends LitElement {
  readonly videoElement: HTMLVideoElement | undefined;
}
