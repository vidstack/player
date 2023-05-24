import { formatTimeSmpte } from '../../../utils/time';
import type { MediaPlayerElement } from '../player';

export class MediaFrames {
  private _player: MediaPlayerElement | null = null;

  /**
   * Set the current `<media-player>` element.
   */
  setPlayer(player: MediaPlayerElement | null) {
    this._player = player;
  }

  /**
   * The framerate of the video, as provided
   * or estimated.
   */
  get rate(): number {
    return this._player?.$store.frameRate() ?? -1; // todo: frame rate estimation
  }

  /**
   * The current frame the video is on.
   * -1 if unknown
   */
  get frame(): number {
    if (!this._player) {
      if (__DEV__) this._noPlayerWarning(this.toSMPTE.name);
      return -1;
    }

    const seconds = this._player?.$store.currentTime();

    return Math.floor(Number.parseFloat(seconds.toFixed(5)) * this.rate);
  }

  /**
   * Returns an SMPTE timecode.
   *
   * @param frame the current frame
   */
  toSMPTE(frame: number): string {
    if (!this._player) {
      if (__DEV__) this._noPlayerWarning(this.toSMPTE.name);
      return '';
    }

    const seconds = this._player.$store.currentTime();

    return formatTimeSmpte(frame, seconds, this.rate);
  }

  /**
   * Returns seconds from an SMPTE timecode.
   *
   * @param smpte the SMPTE timecode to parse
   */
  fromSMPTE(smpte: string): number {
    const time = smpte.split(':');

    if (time.length > 4 || time.length < 3) {
      throw Error('Unexpected timestamp recieved for conversion to seconds');
    }

    const hours = Number.parseInt(time[0]) * 60 * 60;
    const minutes = Number.parseInt(time[1]) * 60;
    const seconds = Number.parseInt(time[2]);

    return hours + minutes + seconds;
  }

  /**
   * How many frames ahead to skip. Use a
   * negative number to seek backwards.
   *
   * @param frames number of frames forwards or backwards (negative)
   */
  seek(frames: number): void {
    if (!this._player) {
      if (__DEV__) this._noPlayerWarning(this.toSMPTE.name);
      return;
    }

    // we add 0.00001 for proper interactivity
    // todo: check if this is necessary
    this._player.currentTime = (this.frame + frames) / this.rate + 0.00001;
  }

  private _noPlayerWarning(method: string) {
    if (__DEV__) {
      console.warn(
        `[vidstack] attempted to call \`MediaFrameInstance.${method}\`() that requires` +
          ' player but failed because frames could not find a defined player element',
      );
    }
  }
}
