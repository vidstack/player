import * as React from 'react';

import { useContext } from 'maverick.js';
import { useSignal } from 'maverick.js/react';
import { camelToKebabCase } from 'maverick.js/std';
import { mediaContext, type DefaultLayoutTranslations } from 'vidstack';

import { useMediaState } from '../../../hooks/use-media-state';
import { createComputed, createEffect } from '../../../hooks/use-signals';
import { Primitive, type PrimitivePropsWithRef } from '../../primitives/nodes';
import { i18n } from './context';
import type { DefaultKeyboardActionIcons } from './icons';

export type DefaultVideoKeyboardActionDisplayWords =
  | 'Play'
  | 'Pause'
  | 'Enter Fullscreen'
  | 'Exit Fullscreen'
  | 'Enter PiP'
  | 'Exit PiP'
  | 'Closed-Captions On'
  | 'Closed-Captions Off'
  | 'Mute'
  | 'Volume';

export interface DefaultVideoKeyboardActionDisplayTranslations
  extends Pick<DefaultLayoutTranslations, DefaultVideoKeyboardActionDisplayWords> {}

export interface DefaultVideoKeyboardActionDisplayProps extends PrimitivePropsWithRef<'div'> {
  icons: DefaultKeyboardActionIcons;
  translations?: Partial<DefaultVideoKeyboardActionDisplayTranslations> | null;
}

const DefaultVideoKeyboardActionDisplay = React.forwardRef<
  HTMLElement,
  DefaultVideoKeyboardActionDisplayProps
>(({ icons: Icons, translations, ...props }, forwardRef) => {
  const [visible, setVisible] = React.useState(false),
    [Icon, setIcon] = React.useState<any>(null),
    $lastKeyboardAction = useMediaState('lastKeyboardAction');

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

  const $$statusLabel = createComputed(() => getStatusLabel(translations!), [translations]),
    $statusLabel = useSignal($$statusLabel);

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
      key={$lastKeyboardAction}
    >
      <div className="vds-kb-text-wrapper">
        <div className="vds-kb-text">{$text}</div>
      </div>
      {Icon ? (
        <div className="vds-kb-bezel" role="status" aria-label={$statusLabel}>
          <div className="vds-kb-icon">
            <Icon />
          </div>
        </div>
      ) : null}
    </Primitive.div>
  );
});

DefaultVideoKeyboardActionDisplay.displayName = 'DefaultVideoKeyboardActionDisplay';
export { DefaultVideoKeyboardActionDisplay };

function getText() {
  const { $state } = useContext(mediaContext),
    action = $state.lastKeyboardAction()?.action;
  switch (action) {
    case 'toggleMuted':
      return $state.muted() ? '0%' : getVolumeText($state.volume());
    case 'volumeUp':
    case 'volumeDown':
      return getVolumeText($state.volume());
    default:
      return '';
  }
}

function getVolumeText(volume: number) {
  return `${Math.round(volume * 100)}%`;
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
    default:
      return null;
  }
}

function getStatusLabel(translations?: Partial<DefaultVideoKeyboardActionDisplayTranslations>) {
  const text = getStatusText(translations);
  return text ? i18n(translations, text) : null;
}

function getStatusText(translations?: Partial<DefaultVideoKeyboardActionDisplayTranslations>): any {
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
        : `${Math.round($state.volume() * 100)}% ${i18n(translations, 'Volume')}`;
    default:
      return null;
  }
}
