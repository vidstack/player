import { formatTimeSmpte } from '../../../utils/time';
import type { MediaStore } from '../api/store';
import type { MediaPlayerElement } from '../player';

export class MediaFrames {
  constructor(private _store: MediaStore) {}

  /**
   * The framerate of the video, as provided
   * or estimated.
   */
  get rate(): number {
    return this._store.frameRate() ?? -1; // todo: frame rate estimation
  }

  /**
   * The current frame the video is on.
   * -1 if unknown
   */
  get frame(): number {
    const seconds = this._store.currentTime();

    return Math.floor(Number.parseFloat(seconds.toFixed(5)) * this.rate);
  }

  /**
   * Returns an SMPTE timecode.
   *
   * @param frame the current frame
   */
  toSMPTE(frame: number): string {
    const seconds = this._store.currentTime();

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
    // we add 0.00001 for proper interactivity
    // todo: check if this is necessary
    this._store.currentTime.set((this.frame + frames) / this.rate + 0.00001);
  }
}
