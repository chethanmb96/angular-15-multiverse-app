import { PageInfo } from './character.model';

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string; // e.g., "S01E01"
  characters: string[];
  url: string;
  created: string;
}

export interface EpisodeResponse {
  info: PageInfo;
  results: Episode[];
}
