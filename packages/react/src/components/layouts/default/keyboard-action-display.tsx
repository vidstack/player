import * as React from 'react';

import { useContext } from 'maverick.js';
import { useSignal } from 'maverick.js/react';
import { camelToKebabCase } from 'maverick.js/std';
import { mediaContext, type DefaultLayoutTranslations } from 'vidstack';

import { useMediaState } from '../../../hooks/use-media-state';
import { createComputed, createEffect } from '../../../hooks/use-signals';
import { Primitive, type PrimitivePropsWithRef } from '../../primitives/nodes';
import { i18n, useDefaultLayoutContext } from './context';
import type { DefaultKeyboardActionIcons } from './icons';

export type DefaultKeyboardDisplayWords =
  | 'Play'
  | 'Pause'
  | 'Enter Fullscreen'
  | 'Exit Fullscreen'
  | 'Enter PiP'
  | 'Exit PiP'
  | 'Closed-Captions On'
  | 'Closed-Captions Off'
  | 'Mute'
  | 'Volume'
  | 'Seek Forward'
  | 'Seek Backward';

export interface DefaultKeyboardDisplayTranslations
  extends Pick<DefaultLayoutTranslations, DefaultKeyboardDisplayWords> {}

export interface DefaultKeyboardDisplayProps
  extends Omit<PrimitivePropsWithRef<'div'>, 'disabled'> {
  icons?: DefaultKeyboardActionIcons;
  translations?: Partial<DefaultKeyboardDisplayTranslations> | null;
}

const DefaultKeyboardDisplay = React.forwardRef<HTMLElement, DefaultKeyboardDisplayProps>(
  ({ icons: Icons, translations, ...props }, forwardRef) => {
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
        ref={forwardRef as any}
      >
        <div className="vds-kb-text-wrapper">
          <div className="vds-kb-text">{$text}</div>
        </div>
        <DefaultKeyboardStatus className="vds-kb-bezel" key={count}>
          {Icon ? (
            <div className="vds-kb-icon">
              <Icon />
            </div>
          ) : null}
        </DefaultKeyboardStatus>
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

function getIcon(Icons?: DefaultKeyboardActionIcons) {
  const { $state } = useContext(mediaContext),
    action = $state.lastKeyboardAction()?.action;
  switch (action) {
    case 'togglePaused':
      return !$state.paused() ? Icons?.Play : Icons?.Pause;
    case 'toggleMuted':
      return $state.muted() || $state.volume() === 0
        ? Icons?.Mute
        : $state.volume() >= 0.5
          ? Icons?.VolumeUp
          : Icons?.VolumeDown;
    case 'toggleFullscreen':
      return $state.fullscreen() ? Icons?.EnterFullscreen : Icons?.ExitFullscreen;
    case 'togglePictureInPicture':
      return $state.pictureInPicture() ? Icons?.EnterPiP : Icons?.ExitPiP;
    case 'toggleCaptions':
      return $state.hasCaptions()
        ? $state.textTrack()
          ? Icons?.CaptionsOn
          : Icons?.CaptionsOff
        : null;
    case 'volumeUp':
      return Icons?.VolumeUp;
    case 'volumeDown':
      return Icons?.VolumeDown;
    case 'seekForward':
      return Icons?.SeekForward;
    case 'seekBackward':
      return Icons?.SeekBackward;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------------------------------
 * DefaultKeyboardStatus
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultKeyboardStatusProps extends PrimitivePropsWithRef<'div'> {}

const DefaultKeyboardStatus = React.forwardRef<HTMLDivElement, DefaultKeyboardStatusProps>(
  ({ children, ...props }, forwardRef) => {
    const { translations } = useDefaultLayoutContext(),
      [isBusy, setIsBusy] = React.useState(false),
      $$statusLabel = createComputed(() => getStatusLabel(translations!), [translations]),
      $statusLabel = useSignal($$statusLabel);

    React.useEffect(() => {
      setIsBusy(true);

      const id = window.setTimeout(() => {
        setIsBusy(false);
      }, 150);

      return () => window.clearTimeout(id);
    }, [$statusLabel]);

    return (
      <div
        role="status"
        aria-label={$statusLabel}
        aria-live="assertive"
        aria-busy={isBusy ? 'true' : undefined}
        {...props}
        ref={forwardRef}
      >
        {children}
      </div>
    );
  },
);

DefaultKeyboardStatus.displayName = 'DefaultKeyboardStatus';
export { DefaultKeyboardStatus };

function getStatusLabel(translations?: Partial<DefaultKeyboardDisplayTranslations>) {
  const text = getStatusText(translations);
  return text ? i18n(translations, text) : null;
}

function getStatusText(translations?: Partial<DefaultKeyboardDisplayTranslations>): any {
  const { $state } = useContext(mediaContext),
    action = $state.lastKeyboardAction()?.action;
  switch (action) {
    case 'togglePaused':
      return !$state.paused() ? 'Play' : 'Pause';
    case 'toggleFullscreen':
      return $state.fullscreen() ? 'Enter Fullscreen' : 'Exit Fullscreen';
    case 'togglePictureInPicture':
      return $state.pictureInPicture() ? 'Enter PiP' : 'Exit PiP';
    case 'toggleCaptions':
      return $state.textTrack() ? 'Closed-Captions On' : 'Closed-Captions Off';
    case 'toggleMuted':
    case 'volumeUp':
    case 'volumeDown':
      return $state.muted() || $state.volume() === 0
        ? 'Mute'
        : `${Math.round($state.volume() * ($state.audioGain() ?? 1) * 100)}% ${i18n(translations, 'Volume')}`;
    case 'seekForward':
      return 'Seek Forward';
    case 'seekBackward':
      return 'Seek Backward';
    default:
      return null;
  }
}
