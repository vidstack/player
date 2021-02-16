export interface Bootable {
  bootTarget: HTMLElement;
  boot(): Promise<void>;
}
