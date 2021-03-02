import theme from './theme';
import { addons } from '@storybook/addons';

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  theme,
  panelPosition: 'right',
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  showRoots: false,
});
