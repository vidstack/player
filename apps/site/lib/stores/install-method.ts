import { writable } from 'svelte/store';

export type InstallMethodType = 'npm' | 'cdn';

export const installMethods: InstallMethodType[] = ['npm', 'cdn'];

export const installMethod = writable<InstallMethodType>('npm');
