import './vds-video';
import { html } from 'lit-element';
import {
  PlayerStorybookArgTypes,
  PLAYER_STORYBOOK_ARG_TYPES,
  renderPlayerStorybookTemplate,
} from '../../core';
import { Story } from '../../shared/storybook';

export default {
  title: 'Providers/Video',
  component: 'vds-video',
  argTypes: {
    ...PLAYER_STORYBOOK_ARG_TYPES,
    poster: { control: 'text' },
  },
};

export type VideoArgTypes = PlayerStorybookArgTypes & {
  src: string;
  type: string;
  poster: string;
};

const Template: Story<VideoArgTypes> = ({
  src = 'https://media.vidstack.io/720p.mp4',
  type = 'video/mp4',
  poster = 'https://media.vidstack.io/poster.png',
}) =>
  renderPlayerStorybookTemplate({
    content: html`
      <vds-video src="${src}" poster="${poster}" cross-origin="anonymous">
      </vds-video>
    `,
  });

export const Video = Template.bind({});
