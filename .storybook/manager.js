import theme from './theme';
import { addons } from '@web/storybook-prebuilt/addons';

const isProduction = !window.origin.includes('localhost');

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  theme: theme(isProduction),
  panelPosition: 'right',
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  showRoots: false,
});
