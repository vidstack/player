import styles from './video-layout.module.css';

import { CaptionButton } from '../buttons/caption-button';
import { FullscreenButton } from '../buttons/fullscreen-button';
import { MuteButton } from '../buttons/mute-button';
import { PIPButton } from '../buttons/pip-button';
import { PlayButton } from '../buttons/play-button';
import { ChapterTitle } from '../chapter-title';
import { SettingsMenu } from '../menus/settings-menu';
import { TimeSlider } from '../sliders/time-slider';
import { VolumeSlider } from '../sliders/volume-slider';
import { TimeGroup } from '../time-group';
import { VideoCaptions } from '../video-captions';
import { VideoGestures } from '../video-gestures';

export function VideoLayout(props: VideoLayoutProps) {
  return (
    <>
      <VideoGestures />
      <VideoCaptions />
      <media-controls class={`vds-controls ${styles.controls}`}>
        <div class="vds-controls-spacer" />
        <media-controls-group class={`vds-controls-group ${styles.controlsGroup}`}>
          <TimeSlider thumbnails={props.thumbnails} />
        </media-controls-group>
        <media-controls-group class={`vds-controls-group ${styles.controlsGroup}`}>
          <PlayButton tooltipPlacement="top start" />
          <MuteButton tooltipPlacement="top" />
          <VolumeSlider />
          <TimeGroup />
          <ChapterTitle />
          <div class="vds-controls-spacer" />
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
