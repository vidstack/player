export interface VimeoVideoInfo {
  title: string;
  poster: string;
  duration: number;
  pro: boolean;
}

export interface VimeoChapter {
  startTime: number;
  title: string;
  index: number;
}

export interface VimeoTextTrack {
  label: string;
  language: string;
  kind: 'captions' | 'subtitles';
  mode: 'showing' | 'disabled';
}

export interface VimeoTextCue {
  html: string;
  kind: 'captions' | 'subtitles';
  label: string;
  language: string;
  text: string;
}

export interface VimeoQuality {
  id: string;
  label: string;
  active: boolean;
}

export interface VimeoOEmbedData {
  account_type: 'basic' | 'pro' | 'business';
  author_name: string;
  author_url: string;
  description: string;
  duration: number;
  height: number;
  html: string;
  is_plus: '0' | '1';
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_url_with_play_button: string;
  thumbnail_url: string;
  thumbnail_width: number;
  title: string;
  type: 'audio' | 'video';
  upload_date: string;
  uri: string;
  version: string;
  video_id: number;
  width: number;
}
