export interface IMultiLang {
  vi?: string;
  en?: string;
  [key: string]: string | undefined;
}

export interface IFranchise {
  _id: string;
  title: IMultiLang;
  description: IMultiLang;
  slug: IMultiLang;
  movies: Array<{
    _id: string;
    title: IMultiLang;
    slug: IMultiLang;
  }>;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FranchiseCreateDTO {
  title: IMultiLang;
  description: IMultiLang;
  slug: IMultiLang;
  movies: string[];
  isPublished: boolean;
}

export interface FranchiseUpdateDTO extends Partial<FranchiseCreateDTO> {
  _id: string;
}
