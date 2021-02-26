import './vds-player';
import { html, TemplateResult } from 'lit-element';

export const PLAYER_STORYBOOK_ARG_TYPES = {
  src: { control: 'text' },
  aspectRatio: { control: 'text' },
  paused: { control: 'boolean' },
  controls: { control: 'boolean' },
  muted: { control: 'boolean' },
  volume: { control: 'number' },
  currentTime: { control: 'number' },
};

export interface PlayerStorybookArgTypes {
  aspectRatio: string;
  paused: boolean;
  controls: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  content: TemplateResult;
}

export function renderPlayerStorybookTemplate<
  T extends Partial<PlayerStorybookArgTypes>
>({
  aspectRatio = '16:9',
  paused = true,
  controls = true,
  muted = false,
  volume = 1,
  currentTime = 0,
  content = html``,
}: T): TemplateResult {
  return html`
    <vds-player
      .paused="${paused}"
      .muted="${muted}"
      .volume="${volume}"
      .controls="${controls}"
      .currentTime="${currentTime}"
      .aspectRatio="${aspectRatio}"
    >
      ${content}
    </vds-player>
  `;
}
