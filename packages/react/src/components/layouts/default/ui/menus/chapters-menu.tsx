import * as React from 'react';

import { useSignal } from 'maverick.js/react';

import { useChapterOptions } from '../../../../../hooks/options/use-chapter-options';
import { useMediaState } from '../../../../../hooks/use-media-state';
import { isRemotionSrc } from '../../../../../providers/remotion/type-check';
import * as Menu from '../../../../ui/menu';
import * as Thumbnail from '../../../../ui/thumbnail';
import { RemotionThumbnail } from '../../../remotion-ui';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { DefaultTooltip } from '../tooltip';
import type { DefaultMediaMenuProps } from './settings-menu';

/* -------------------------------------------------------------------------------------------------
 * DefaultChaptersMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultChaptersMenu({ tooltip, placement, portalClass }: DefaultMediaMenuProps) {
  const {
      showMenuDelay,
      noModal,
      isSmallLayout,
      icons: Icons,
      menuGroup,
    } = useDefaultLayoutContext(),
    chaptersText = useDefaultLayoutWord('Chapters'),
    options = useChapterOptions(),
    disabled = !options.length,
    { thumbnails } = useDefaultLayoutContext(),
    $src = useMediaState('currentSrc'),
    $viewType = useMediaState('viewType'),
    $offset = !isSmallLayout && menuGroup === 'bottom' && $viewType === 'video' ? 26 : 0,
    $RemotionThumbnail = useSignal(RemotionThumbnail),
    [isOpen, setIsOpen] = React.useState(false);

  if (disabled) return null;

  function onOpen() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }

  const Content = (
    <Menu.Content
      className="vds-chapters-menu-items vds-menu-items"
      placement={placement}
      offset={$offset}
    >
      {isOpen ? (
        <Menu.RadioGroup
          className="vds-chapters-radio-group vds-radio-group"
          value={options.selectedValue}
          data-thumbnails={thumbnails ? '' : null}
        >
          {options.map(
            ({ cue, label, value, startTimeText, durationText, select, setProgressVar }) => (
              <Menu.Radio
                className="vds-chapter-radio vds-radio"
                value={value}
                key={value}
                onSelect={select}
                ref={setProgressVar}
              >
                {thumbnails ? (
                  <Thumbnail.Root src={thumbnails} className="vds-thumbnail" time={cue.startTime}>
                    <Thumbnail.Img />
                  </Thumbnail.Root>
                ) : $RemotionThumbnail && isRemotionSrc($src) ? (
                  <$RemotionThumbnail className="vds-thumbnail" frame={cue.startTime * $src.fps!} />
                ) : null}
                <div className="vds-chapter-radio-content">
                  <span className="vds-chapter-radio-label">{label}</span>
                  <span className="vds-chapter-radio-start-time">{startTimeText}</span>
                  <span className="vds-chapter-radio-duration">{durationText}</span>
                </div>
              </Menu.Radio>
            ),
          )}
        </Menu.RadioGroup>
      ) : null}
    </Menu.Content>
  );

  return (
    <Menu.Root
      className="vds-chapters-menu vds-menu"
      showDelay={showMenuDelay}
      onOpen={onOpen}
      onClose={onClose}
    >
      <DefaultTooltip content={chaptersText} placement={tooltip}>
        <Menu.Button
          className="vds-menu-button vds-button"
          disabled={disabled}
          aria-label={chaptersText}
        >
          <Icons.Menu.Chapters className="vds-icon" />
        </Menu.Button>
      </DefaultTooltip>
      {noModal || !isSmallLayout ? (
        Content
      ) : (
        <Menu.Portal
          className={portalClass}
          disabled="fullscreen"
          data-sm={isSmallLayout ? '' : null}
          data-lg={!isSmallLayout ? '' : null}
          data-size={isSmallLayout ? 'sm' : 'lg'}
        >
          {Content}
        </Menu.Portal>
      )}
    </Menu.Root>
  );
}

DefaultChaptersMenu.displayName = 'DefaultChaptersMenu';
export { DefaultChaptersMenu };
