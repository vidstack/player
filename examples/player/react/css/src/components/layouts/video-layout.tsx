import captionStyles from '../../styles/captions.module.css';
import chapterTitleStyles from '../../styles/chapter-title.module.css';
import styles from '../../styles/video-layout.module.css';

import { Captions, ChapterTitle, Controls, Gesture } from '@vidstack/react';

import * as Buttons from '../buttons';
import * as Menus from '../menus';
import * as Sliders from '../sliders';
import { TimeGroup } from '../time-group';

export interface VideoLayoutProps {
  thumbnails?: string;
}

export function VideoLayout({ thumbnails }: VideoLayoutProps) {
  return (
    <>
      <Gestures />
      <Captions className={captionStyles.captions} />
      <Controls.Root className={styles.controls}>
        <div className={styles.spacer} />
        <Controls.Group className={styles.controlsGroup}>
          <Sliders.Time thumbnails={thumbnails} />
        </Controls.Group>
        <Controls.Group className={styles.controlsGroup}>
          <Buttons.Play tooltipPlacement="top start" />
          <Buttons.Mute tooltipPlacement="top" />
          <Sliders.Volume />
          <TimeGroup />
          <ChapterTitle className={chapterTitleStyles.title} />
          <div className={styles.spacer} />
          <Buttons.Caption tooltipPlacement="top" />
          <Menus.Settings placement="top end" tooltipPlacement="top" />
          <Buttons.PIP tooltipPlacement="top" />
          <Buttons.Fullscreen tooltipPlacement="top end" />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

function Gestures() {
  return (
    <>
      <Gesture className={styles.gesture} event="pointerup" action="toggle:paused" />
      <Gesture className={styles.gesture} event="dblpointerup" action="toggle:fullscreen" />
      <Gesture className={styles.gesture} event="pointerup" action="toggle:controls" />
      <Gesture className={styles.gesture} event="dblpointerup" action="seek:-10" />
      <Gesture className={styles.gesture} event="dblpointerup" action="seek:10" />
    </>
  );
}
