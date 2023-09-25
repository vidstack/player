import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useCaptionOptions, useMediaPlayer } from '@vidstack/react';
import { CheckCircle, CircleIcon, SubtitlesIcon } from 'lucide-react';

import { buttonClass, tooltipClass } from './buttons';

export interface MenuProps {
  side?: DropdownMenu.MenuContentProps['side'];
  align?: DropdownMenu.MenuContentProps['align'];
  offset?: DropdownMenu.MenuContentProps['sideOffset'];
  tooltipSide?: Tooltip.TooltipContentProps['side'];
  tooltipAlign?: Tooltip.TooltipContentProps['align'];
  tooltipOffset?: number;
}

// We can reuse this class for other menus.
const menuClass =
  'animate-out fade-out z-[9999] slide-in-from-bottom-4 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-out-to-bottom-2 flex max-h-[400px] min-w-[260px] flex-col rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[15px] font-medium outline-none backdrop-blur-sm duration-300';

export function Captions({
  side = 'top',
  align = 'end',
  offset = 0,
  tooltipSide = 'top',
  tooltipAlign = 'center',
  tooltipOffset = 0,
}: MenuProps) {
  const player = useMediaPlayer(),
    options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? 'Off';
  return (
    <DropdownMenu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger className={buttonClass} disabled={options.disabled}>
            <SubtitlesIcon className="w-7 h-7" />
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content
          className={tooltipClass}
          side={tooltipSide}
          align={tooltipAlign}
          sideOffset={tooltipOffset}
        >
          Captions
        </Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Content
        className={menuClass}
        side={side}
        align={align}
        sideOffset={offset}
        collisionBoundary={player?.el}
      >
        <DropdownMenu.Label className="flex items-center w-full px-1.5 mb-2 font-medium text-[15px]">
          <SubtitlesIcon className="w-5 h-5 mr-1.5 translate-y-px" />
          Captions
          <span className="ml-auto text-sm text-white/50">{hint}</span>
        </DropdownMenu.Label>
        <DropdownMenu.RadioGroup className="w-full flex flex-col" value={options.selectedValue}>
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function Radio({ children, ...props }: DropdownMenu.MenuRadioItemProps) {
  return (
    <DropdownMenu.RadioItem
      className="ring-media-focus group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2.5 outline-none hocus:bg-white/10 data-[focus]:ring-[3px] text-sm"
      {...props}
    >
      <CircleIcon className="h-4 w-4 text-white group-data-[state=checked]:hidden" />
      <CheckCircle
        className="text-media-brand hidden h-4 w-4 group-data-[state=checked]:block"
        type="radio-button-selected"
      />
      <span className="ml-2">{children}</span>
    </DropdownMenu.RadioItem>
  );
}
