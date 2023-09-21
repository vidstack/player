import styles from './audio-layout.module.css';

import { AudioCaptions } from '../audio-captions';
import { CaptionButton } from '../buttons/caption-button';
import { MuteButton } from '../buttons/mute-button';
import { PlayButton } from '../buttons/play-button';
import { SeekBackButton } from '../buttons/seek-back-button';
import { SeekForwardButton } from '../buttons/seek-forward-button';
import { ChapterTitle } from '../chapter-title';
import { SettingsMenu } from '../menus/settings-menu';
import { TimeSlider } from '../sliders/time-slider';
import { VolumeSlider } from '../sliders/volume-slider';
import { TimeGroup } from '../time-group';

export function AudioLayout() {
  return (
    <>
      <AudioCaptions />
      <media-controls class={`vds-controls ${styles.controls}`}>
        <media-controls-group class={`vds-controls-group ${styles.controlsGroup}`}>
          <TimeSlider />
        </media-controls-group>
        <media-controls-group class={`vds-controls-group ${styles.controlsGroup}`}>
          <SeekBackButton tooltipPlacement="top start" />
          <PlayButton tooltipPlacement="top" />
          <SeekForwardButton tooltipPlacement="top" />
          <TimeGroup />
          <ChapterTitle />
          <MuteButton tooltipPlacement="top" />
          <VolumeSlider />
          <CaptionButton tooltipPlacement="top" />
          <SettingsMenu />
        </media-controls-group>
      </media-controls>
    </>
  );
}
