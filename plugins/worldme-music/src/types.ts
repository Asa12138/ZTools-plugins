export interface MusicItem {
  platform: string;
  id: string;
  title: string;
  artist?: string;
  album?: string;
  artwork?: string;
  duration?: number;
  url?: string;
  lrc?: string;
  rawLrc?: string;
  /** 本地附加：所在音源 hash（便于重新解析） */
  $$hash?: string;
  [k: string]: any;
}

export interface SourceMeta {
  hash: string;
  platform: string;
  title?: string;
  author?: string;
  version?: string;
  srcUrl?: string;
  primaryKey?: string[];
  cacheControl?: string;
  supportedSearchType?: string[];
  userVariables?: Array<{ key: string; title?: string; hint?: string }>;
  enabled: boolean;
  order: number;
  stateCode?: string;
  installedAt?: number;
  updatedAt?: number;
  [k: string]: any;
}

export type SearchType = 'music' | 'album' | 'artist' | 'sheet' | 'lyric';
export type QualityKey = 'low' | 'standard' | 'high' | 'super';

export interface SearchResult {
  isEnd: boolean;
  data: MusicItem[];
}

export interface LyricLine {
  time: number;
  text: string;
  translation?: string;
}

export interface LyricData {
  rawLrc: string;
  translation: string;
  lines: LyricLine[];
}

export interface PlaylistItem extends MusicItem {
  $$addedAt?: number;
}
