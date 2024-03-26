export interface VidstackPlayerLayoutLoader {
  readonly name: string;
  load(): void | Promise<void>;
  create(): HTMLElement[] | Promise<HTMLElement[]>;
}
