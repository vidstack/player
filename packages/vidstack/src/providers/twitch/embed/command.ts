export enum TwitchCommand {
  disableCaptions,
  enableCaptions,
  pause,
  play,
  seek,
  setChannel,
  setChannelId,
  setCollection,
  setQuality,
  setVideo,
  setMuted,
  setVolume,
}

export interface TwitchCommandArg {
  [TwitchCommand.disableCaptions]: null;
  [TwitchCommand.enableCaptions]: null;
  [TwitchCommand.pause]: null;
  [TwitchCommand.play]: null;
  [TwitchCommand.seek]: number;
  [TwitchCommand.setChannel]: string;
  [TwitchCommand.setChannelId]: number;
  [TwitchCommand.setCollection]: [string, string]; // [collection id, video id]
  [TwitchCommand.setQuality]: string;
  [TwitchCommand.setVideo]: [string, string]; // [video id, timestamp]
  [TwitchCommand.setMuted]: boolean;
  [TwitchCommand.setVolume]: number;
}
