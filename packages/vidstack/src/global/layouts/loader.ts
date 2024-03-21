export interface VidstackPlayerLayoutLoader {
  load(): void | Promise<void>;
  create(): HTMLElement[] | Promise<HTMLElement[]>;
}
