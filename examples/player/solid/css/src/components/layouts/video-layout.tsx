import styles from './video-layout.module.css';

import { CaptionButton } from '../buttons/caption-button';
import { FullscreenButton } from '../buttons/fullscreen-button';
import { MuteButton } from '../buttons/mute-button';
import { PIPButton } from '../buttons/pip-button';
import { PlayButton } from '../buttons/play-button';
import { Captions } from '../captions';
import { ChapterTitle } from '../chapter-title';
import { Gestures } from '../gestures';
import { SettingsMenu } from '../menus/settings-menu';
import { TimeSlider } from '../sliders/time-slider';
import { VolumeSlider } from '../sliders/volume-slider';
import { TimeGroup } from '../time-group';

export function VideoLayout(props: VideoLayoutProps) {
  return (
    <>
      <Gestures />
      <Captions />
      <media-controls class={styles.controls}>
        <div class={styles.spacer} />
        <media-controls-group class={styles.controlsGroup}>
          <TimeSlider thumbnails={props.thumbnails} />
        </media-controls-group>
        <media-controls-group class={styles.controlsGroup}>
          <PlayButton tooltipPlacement="top start" />
          <MuteButton tooltipPlacement="top" />
          <VolumeSlider />
          <TimeGroup />
          <ChapterTitle />
          <div class={styles.spacer} />
          <CaptionButton tooltipPlacement="top" />
          <SettingsMenu />
          <PIPButton tooltipPlacement="top" />
          <FullscreenButton tooltipPlacement="top end" />
        </media-controls-group>
      </media-controls>
    </>
  );
}

export interface VideoLayoutProps {
  thumbnails: string;
}
