import type { TwitchCommand, TwitchCommandArg } from './command';
import type { TwitchEventPayload } from './event';

/**
 * Incoming Twitch Embed message (from embed to parent)
 * UPDATE_STATE has namespace 'twitch-embed-player-proxy', all other events 'twitch-embed-player'
 */
export interface TwitchMessage<T extends keyof TwitchEventPayload> {
  eventName: T;
  params: TwitchEventPayload[T];
  namespace: 'twitch-embed-player' | 'twitch-embed-player-proxy';
}

/**
 * Outgoing Twitch Embed message (from parent to embed)
 */
export interface TwitchCommandMessage<T extends TwitchCommand> {
  eventName: T;
  params: TwitchCommandArg[T];
  namespace: 'twitch-embed-player-proxy';
}
