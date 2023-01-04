import type { CustomElementPropDefinitions } from 'maverick.js/element';

export const aspectRatioProps: CustomElementPropDefinitions<AspectRatioProps> = {
  minHeight: { initial: '150px' },
  maxHeight: { initial: '100vh' },
  ratio: { initial: '2/1' },
};

export interface AspectRatioProps {
  /**
   * The minimum height of the container.
   */
  minHeight: string;
  /**
   * The maximum height of the container.
   */
  maxHeight: string;
  /**
   * The desired aspect ratio setting given as `'width/height'` (eg: `'16/9'`).
   *
   * @defaultValue '2/1'
   */
  ratio: string;
}
