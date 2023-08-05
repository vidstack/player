function VdsChaptersMenu({ tooltip, placement }: VdsMenuProps) {
  const chaptersText = useI18N('Chapters'),
    options = useChapterOptions(),
    thumbnailCues = useMediaState('thumbnailCues'),
    disabled = !options.length;
  return (
    <Menu.Root className="vds-chapters-menu vds-menu">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className="vds-menu-button vds-button" disabled={disabled}>
            <Icon paths={chaptersIconPaths} />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
          {chaptersText}
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Portal>
        <Menu.Content className="vds-chapters-menu-items vds-menu-items" placement={placement}>
          <Menu.RadioGroup
            className="vds-chapters-radio-group vds-radio-group"
            value={options.selectedValue}
            data-thumbnails={thumbnailCues.length}
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
                  <Thumbnail.Root className="vds-thumbnail" time={cue.startTime}>
                    <Thumbnail.Img />
                  </Thumbnail.Root>
                  <div className="vds-chapter-radio-content">
                    <span className="vds-chapter-radio-label">{label}</span>
                    <span className="vds-chapter-radio-start-time">{startTimeText}</span>
                    <span className="vds-chapter-radio-duration">{durationText}</span>
                  </div>
                </Menu.Radio>
              ),
            )}
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

VdsChaptersMenu.displayName = 'VdsChaptersMenu';
export { VdsChaptersMenu };

/* -------------------------------------------------------------------------------------------------
 * SettingsMenu
 * -----------------------------------------------------------------------------------------------*/

function VdsSettingsMenu({ tooltip, placement }: VdsMenuProps) {
  const settingsText = useI18N('Settings');
  return (
    <Menu.Root className="vds-settings-menu vds-menu">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className="vds-menu-button vds-button">
            <Icon className="vds-rotate-icon" paths={settingsIconPaths} />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="vds-tooltip-content" placement={tooltip}>
          {settingsText}
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Portal>
        <Menu.Content className="vds-settings-menu-items vds-menu-items" placement={placement}>
          <VdsAudioSubmenu />
          <VdsSpeedSubmenu />
          <VdsQualitySubmenu />
          <VdsCaptionSubmenu />
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

VdsSettingsMenu.displayName = 'VdsSettingsMenu';
export { VdsSettingsMenu };

/* -------------------------------------------------------------------------------------------------
 * SubmenuButton
 * -----------------------------------------------------------------------------------------------*/

interface SubmenuButtonProps {
  label: string;
  hint: string;
  icon: string;
  disabled: boolean;
}

function VdsSubmenuButton({ label, hint, icon, disabled }: SubmenuButtonProps) {
  return (
    <Menu.Button className="vds-menu-button" disabled={disabled}>
      <Icon className="vds-menu-button-close-icon" paths={arrowLeftPaths} />
      <Icon className="vds-menu-button-icon" paths={icon} />
      <span className="vds-menu-button-label">{label}</span>
      <span className="vds-menu-button-hint">{hint}</span>
      <Icon className="vds-menu-button-open-icon" paths={arrowRightPaths} />
    </Menu.Button>
  );
}

VdsSubmenuButton.displayName = 'VdsSubmenuButton';

/* -------------------------------------------------------------------------------------------------
 * AudioSubmenu
 * -----------------------------------------------------------------------------------------------*/

function VdsAudioSubmenu() {
  const label = useI18N('Audio'),
    defaultText = useI18N('Default'),
    track = useMediaState('audioTrack'),
    options = useAudioOptions();
  return (
    <Menu.Root className="vds-audio-menu vds-menu">
      <VdsSubmenuButton
        label={label}
        hint={track?.label ?? defaultText}
        icon={musicIconPaths}
        disabled={!options.length}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-audio-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="vds-audio-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

VdsAudioSubmenu.displayName = 'VdsAudioSubmenu';

/* -------------------------------------------------------------------------------------------------
 * SpeedSubmenu
 * -----------------------------------------------------------------------------------------------*/

function VdsSpeedSubmenu() {
  const label = useI18N('Speed'),
    normalText = useI18N('Normal'),
    options = usePlaybackRateOptions(),
    hint = options.selectedValue === '1' ? normalText : options.selectedValue + 'x';
  return (
    <Menu.Root className="vds-speed-menu vds-menu">
      <VdsSubmenuButton
        label={label}
        hint={hint}
        icon={odometerIconPaths}
        disabled={!options.length}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-speed-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="vds-speed-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

VdsSpeedSubmenu.displayName = 'VdsSpeedSubmenu';

/* -------------------------------------------------------------------------------------------------
 * QualitySubmenu
 * -----------------------------------------------------------------------------------------------*/

function VdsQualitySubmenu() {
  const label = useI18N('Quality'),
    autoText = useI18N('Auto'),
    options = useVideoQualityOptions({ sort: 'descending' }),
    autoQuality = useMediaState('autoQuality'),
    remote = useMediaRemote(),
    currentQualityText = options.selectedQuality?.height + 'p' ?? '',
    hint = !autoQuality ? currentQualityText : `${autoText} (${currentQualityText})`;
  return (
    <Menu.Root className="vds-quality-menu vds-menu">
      <VdsSubmenuButton
        label={label}
        hint={hint}
        icon={qualityIconPaths}
        disabled={!options.length}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-quality-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          <Menu.Radio
            className="vds-quality-radio vds-radio"
            value="auto"
            onSelect={(event) => remote.requestAutoQuality(event)}
          >
            <div className="vds-radio-check" />
            {autoText}
          </Menu.Radio>
          {options.map(({ label, value, bitrateText, select }) => (
            <Menu.Radio
              className="vds-quality-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
              <span className="vds-radio-hint">{bitrateText}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

VdsQualitySubmenu.displayName = 'VdsQualitySubmenu';

/* -------------------------------------------------------------------------------------------------
 * CaptionSubmenu
 * -----------------------------------------------------------------------------------------------*/

function VdsCaptionSubmenu() {
  const label = useI18N('Captions'),
    offText = useI18N('Off'),
    track = useMediaState('textTrack'),
    options = useCaptionOptions(),
    remote = useMediaRemote(),
    hint = track && isTrackCaptionKind(track) && track.mode === 'showing' ? track.label : offText;
  return (
    <Menu.Root className="vds-captions-menu vds-menu">
      <VdsSubmenuButton label={label} hint={hint} icon={ccIconPaths} disabled={!options.length} />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-captions-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          <Menu.Radio
            className="vds-caption-radio vds-radio"
            value="off"
            onSelect={(event) => remote.toggleCaptions(event)}
          >
            <div className="vds-radio-check" />
            {offText}
          </Menu.Radio>
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="vds-caption-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

VdsCaptionSubmenu.displayName = 'VdsCaptionSubmenu';
