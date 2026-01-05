export enum MovieType {
  MOVIE = "MOVIE",
  SERIES = "SERIES",
  EPISODE = "EPISODE",
}

export enum MovieFlagType {
  BANNER = "banner",
  TRENDING = "trending",
  HOT = "hot",
  NEW = "new",
  RECOMMENDED = "recommended",
}

export interface IMultiLang {
  vi: string;
  [key: string]: string;
}

export interface IFranchise {
  _id: string;
  title: IMultiLang;
  description: IMultiLang;
  slug: IMultiLang;
  movies: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IGenre {
  _id: string;
  title: IMultiLang;
  slug: IMultiLang;
  defaultLang: string;
  description: IMultiLang;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IPerson {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IMovieFlagMetadata {
  score?: number;
  reason?: string;
  priority?: number;
}

export interface IMovieFlag {
  metadata: IMovieFlagMetadata;
  type: MovieFlagType;
  source: "admin" | "system";
  startAt: string;
  endAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IMovie {
  _id: string;
  franchiseId?: IFranchise;
  title: IMultiLang;
  description: IMultiLang;
  slug: IMultiLang;
  defaultLang: string;
  poster?: string;
  thumbnail?: string;
  banner?: string;
  backdrop?: string;
  trailerUrl?: string;
  type: MovieType;
  currentEpisode?: number;
  totalEpisodes?: number;
  genres: IGenre[];
  cast: IPerson[];
  director?: IPerson;
  ratingAvg: number;
  year?: number;
  country?: string;
  isPublished: boolean;
  flags: IMovieFlag[];
  views: number;
  dailyViews: number;
  weeklyViews: number;
  likes: number;
  favorites: number;
  shares: number;
  comments: number;
  lastTrendingUpdate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// DTOs cho form và API
export interface MovieCreateDTO {
  franchiseId?: string;
  title: IMultiLang;
  description: IMultiLang;
  slug: IMultiLang;
  defaultLang: string;
  poster?: string;
  thumbnail?: string;
  banner?: string;
  backdrop?: string;
  trailerUrl?: string;
  type: MovieType;
  currentEpisode?: number;
  totalEpisodes?: number;
  genres: string[];
  cast: string[];
  director?: string;
  year?: number;
  country?: string;
  isPublished: boolean;
  flags?: Omit<IMovieFlag, "createdAt" | "updatedAt">[];
}

export interface MovieUpdateDTO extends Partial<MovieCreateDTO> {
  _id: string;
}
// Thêm interface cho Genre
// export interface IGenre {
//   _id: string;
//   title: {
//     vi: string;
//     en: string;
//     [key: string]: string;
//   };
//   slug: {
//     vi: string;
//     en: string;
//     [key: string]: string;
//   };
//   defaultLang: string;
//   description?: {
//     vi: string;
//     en: string;
//     [key: string]: string;
//   };
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// // Thêm interface cho Person
// export interface IPerson {
//   _id: string;
//   name: string;
//   avatar?: string;
//   bio?: string;
//   type?: string; // 'actor', 'actress', 'director', etc.
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }
