import * as React from 'react';

import { useContext } from 'maverick.js';
import { useSignal } from 'maverick.js/react';
import { camelToKebabCase } from 'maverick.js/std';
import { mediaContext } from 'vidstack';

import { useMediaState } from '../../../../hooks/use-media-state';
import { createComputed, createEffect } from '../../../../hooks/use-signals';
import { Primitive, type PrimitivePropsWithRef } from '../../../primitives/nodes';
import type { DefaultKeyboardDisplayIcons } from '../icons';

export interface DefaultKeyboardDisplayProps
  extends Omit<PrimitivePropsWithRef<'div'>, 'disabled'> {
  icons: DefaultKeyboardDisplayIcons;
}

const DefaultKeyboardDisplay = React.forwardRef<HTMLElement, DefaultKeyboardDisplayProps>(
  ({ icons: Icons, ...props }, forwardRef) => {
    const [visible, setVisible] = React.useState(false),
      [Icon, setIcon] = React.useState<any>(null),
      [count, setCount] = React.useState(0),
      $lastKeyboardAction = useMediaState('lastKeyboardAction');

    React.useEffect(() => {
      setCount((n) => n + 1);
    }, [$lastKeyboardAction]);

    const actionDataAttr = React.useMemo(() => {
      const action = $lastKeyboardAction?.action;
      return action && visible ? camelToKebabCase(action) : null;
    }, [visible, $lastKeyboardAction]);

    const className = React.useMemo(
      () =>
        `vds-kb-action${!visible ? ' hidden' : ''}${props.className ? ` ${props.className}` : ''}`,
      [visible],
    );

    const $$text = createComputed(getText),
      $text = useSignal($$text);

    createEffect(() => {
      const Icon = getIcon(Icons);
      setIcon(() => Icon);
    }, [Icons]);

    React.useEffect(() => {
      setVisible(!!$lastKeyboardAction);
      const id = setTimeout(() => setVisible(false), 500);
      return () => {
        setVisible(false);
        window.clearTimeout(id);
      };
    }, [$lastKeyboardAction]);

    return (
      <Primitive.div
        {...props}
        className={className}
        data-action={actionDataAttr}
        ref={forwardRef as React.Ref<any>}
      >
        <div className="vds-kb-text-wrapper">
          <div className="vds-kb-text">{$text}</div>
        </div>
        <div className="vds-kb-bezel" key={count}>
          {Icon ? (
            <div className="vds-kb-icon">
              <Icon />
            </div>
          ) : null}
        </div>
      </Primitive.div>
    );
  },
);

DefaultKeyboardDisplay.displayName = 'DefaultKeyboardDisplay';
export { DefaultKeyboardDisplay };

function getText() {
  const { $state } = useContext(mediaContext),
    action = $state.lastKeyboardAction()?.action,
    audioGain = $state.audioGain() ?? 1;
  switch (action) {
    case 'toggleMuted':
      return $state.muted() ? '0%' : getVolumeText($state.volume(), audioGain);
    case 'volumeUp':
    case 'volumeDown':
      return getVolumeText($state.volume(), audioGain);
    default:
      return '';
  }
}

function getVolumeText(volume: number, gain: number) {
  return `${Math.round(volume * gain * 100)}%`;
}

function getIcon(Icons: DefaultKeyboardDisplayIcons) {
  const { $state } = useContext(mediaContext),
    action = $state.lastKeyboardAction()?.action;
  switch (action) {
    case 'togglePaused':
      return !$state.paused() ? Icons.Play : Icons.Pause;
    case 'toggleMuted':
      return $state.muted() || $state.volume() === 0
        ? Icons.Mute
        : $state.volume() >= 0.5
          ? Icons.VolumeUp
          : Icons.VolumeDown;
    case 'toggleFullscreen':
      return $state.fullscreen() ? Icons.EnterFullscreen : Icons.ExitFullscreen;
    case 'togglePictureInPicture':
      return $state.pictureInPicture() ? Icons.EnterPiP : Icons.ExitPiP;
    case 'toggleCaptions':
      return $state.hasCaptions()
        ? $state.textTrack()
          ? Icons.CaptionsOn
          : Icons.CaptionsOff
        : null;
    case 'volumeUp':
      return Icons.VolumeUp;
    case 'volumeDown':
      return Icons.VolumeDown;
    case 'seekForward':
      return Icons.SeekForward;
    case 'seekBackward':
      return Icons.SeekBackward;
    default:
      return null;
  }
}
