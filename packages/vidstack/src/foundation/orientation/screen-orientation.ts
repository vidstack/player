export type ScreenOrientationType =
  /**
   * Landscape-primary is an orientation where the screen width is greater than the screen height.
   * If the device's natural orientation is landscape, then it is in landscape-primary when held
   * in that position. If the device's natural orientation is portrait, the user agent sets
   * landscape-primary from the two options as shown in the screen orientation values table.
   */
  | 'landscape-primary'

  /**
   * Landscape-secondary is an orientation where the screen width is greater than the screen
   * height. If the device's natural orientation is landscape, it is in landscape-secondary when
   * rotated 180º from its natural orientation. If the device's natural orientation is portrait,
   * the user agent sets landscape-secondary from the two options as shown in the screen
   * orientation values table.
   */
  | 'landscape-secondary'

  /**
   * Portrait-primary is an orientation where the screen width is less than or equal to the screen
   * height. If the device's natural orientation is portrait, then it is in portrait-primary when
   * held in that position. If the device's natural orientation is landscape, the user agent sets
   * portrait-primary from the two options as shown in the screen orientation values table.
   */
  | 'portrait-primary'

  /**
   * Portrait-secondary is an orientation where the screen width is less than or equal to the
   * screen height. If the device's natural orientation is portrait, then it is in
   * portrait-secondary when rotated 180º from its natural position. If the device's natural
   * orientation is landscape, the user agent sets portrait-secondary from the two options as
   * shown in the screen orientation values table.
   */
  | 'portrait-secondary';

export type ScreenOrientationLockType =
  /**
   * Any is an orientation that means the screen can be locked to any one of portrait-primary,
   * portrait-secondary, landscape-primary and landscape-secondary.
   */
  | 'any'

  /**
   * Landscape is an orientation where the screen width is greater than the screen height and
   * depending on platform convention locking the screen to landscape can represent
   * landscape-primary, landscape-secondary or both.
   */
  | 'landscape'

  /**
   * Landscape-primary is an orientation where the screen width is greater than the screen height.
   * If the device's natural orientation is landscape, then it is in landscape-primary when held
   * in that position. If the device's natural orientation is portrait, the user agent sets
   * landscape-primary from the two options as shown in the screen orientation values table.
   */
  | 'landscape-primary'

  /**
   * Landscape-secondary is an orientation where the screen width is greater than the screen
   * height. If the device's natural orientation is landscape, it is in landscape-secondary when
   * rotated 180º from its natural orientation. If the device's natural orientation is portrait,
   * the user agent sets landscape-secondary from the two options as shown in the screen
   * orientation values table.
   */
  | 'landscape-secondary'

  /**
   * Natural is an orientation that refers to either portrait-primary or landscape-primary
   * depending on the device's usual orientation. This orientation is usually provided by the
   * underlying operating system.
   */
  | 'natural'

  /**
   * Portrait is an orientation where the screen width is less than or equal to the screen height
   * and depending on platform convention locking the screen to portrait can represent
   * portrait-primary, portrait-secondary or both.
   */
  | 'portrait'

  /**
   * Portrait-primary is an orientation where the screen width is less than or equal to the screen
   * height. If the device's natural orientation is portrait, then it is in portrait-primary when
   * held in that position. If the device's natural orientation is landscape, the user agent sets
   * portrait-primary from the two options as shown in the screen orientation values table.
   */
  | 'portrait-primary'

  /**
   * Portrait-secondary is an orientation where the screen width is less than or equal to the
   * screen height. If the device's natural orientation is portrait, then it is in
   * portrait-secondary when rotated 180º from its natural position. If the device's natural
   * orientation is landscape, the user agent sets portrait-secondary from the two options as
   * shown in the screen orientation values table.
   */
  | 'portrait-secondary';
