export interface IMultiLang {
  vi?: string;
  en?: string;
  [key: string]: string | undefined;
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

export interface GenreCreateDTO {
  title: IMultiLang;
  slug: IMultiLang;
  defaultLang: string;
  description: IMultiLang;
  isActive: boolean;
}

export interface GenreUpdateDTO extends Partial<GenreCreateDTO> {
  _id: string;
}
