import { CSSResultArray, LitElement } from 'lit-element';
import { playerStyles } from './player.css';
import { PlayerContextMixin } from './PlayerContextMixin';
import { PlayerPropsMixin } from './PlayerPropsMixin';

export class Player extends PlayerPropsMixin(PlayerContextMixin(LitElement)) {
  public static get styles(): CSSResultArray {
    return [playerStyles];
  }
}

const player = new Player();
// TODO: this should not be allowed (fix typing in PlayerPropsMixin).
player.duration = 200;
