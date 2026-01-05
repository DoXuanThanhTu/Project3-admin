export interface IMultiLang {
  vi?: string;
  en?: string;
  [key: string]: string | undefined;
}

export interface IMovie {
  _id: string;
  title: IMultiLang;
  slug: IMultiLang;
}

export interface IServer {
  _id: string;
  name: string;
}

export interface IEpisode {
  _id: string;
  movieId: IMovie;
  serverId: IServer;
  title: IMultiLang;
  slug: IMultiLang;
  defaultLang: string;
  episodeOrLabel: string;
  videoUrl: string;
  duration?: string;
  thumbnail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EpisodeCreateDTO {
  movieId: string;
  serverId: string;
  title: IMultiLang;
  slug: IMultiLang;
  defaultLang: string;
  episodeOrLabel: string;
  videoUrl: string;
  duration?: string;
  thumbnail?: string;
  isPublished: boolean;
}

export interface EpisodeUpdateDTO extends Partial<EpisodeCreateDTO> {
  _id: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EpisodeListResponse {
  success: boolean;
  data: IEpisode[];
  pagination: PaginationData;
}

export interface FilterOptions {
  movieId?: string;
  serverId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
