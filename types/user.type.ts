export interface IUser {
  _id: string;
  email: string;
  role: string;
  avatar?: string;
  cover?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isVerified?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  displayName?: string;
  __v: number;
}

export interface UserCreateDTO {
  email: string;
  password: string;
  role: string;
  avatar?: string;
  cover?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  isActive?: boolean;
}

export interface UserUpdateDTO
  extends Partial<Omit<UserCreateDTO, "password">> {
  _id: string;
  password?: string; // Optional, only when changing password
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserListResponse {
  success: boolean;
  data: IUser[];
  pagination: PaginationData;
}

export interface FilterOptions {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
