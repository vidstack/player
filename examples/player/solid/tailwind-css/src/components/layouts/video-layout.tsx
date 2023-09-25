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
      <media-controls
        class={`${styles.controls} media-controls:opacity-100 absolute inset-0 z-10 flex h-full w-full flex-col bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity`}
      >
        <div class="flex-1" />
        <media-controls-group class="flex w-full items-center px-2">
          <TimeSlider thumbnails={props.thumbnails} />
        </media-controls-group>
        <media-controls-group class="-mt-0.5 flex w-full items-center px-2 pb-2">
          <PlayButton tooltipPlacement="top start" />
          <MuteButton tooltipPlacement="top" />
          <VolumeSlider />
          <TimeGroup />
          <ChapterTitle />
          <div class="flex-1" />
          <CaptionButton tooltipPlacement="top" />
          <SettingsMenu placement="top end" tooltipPlacement="top" />
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
