import { LitElement } from 'lit-element';

export interface VideoPresentationControllerHost extends LitElement {
  readonly videoElement: HTMLVideoElement | undefined;
}
