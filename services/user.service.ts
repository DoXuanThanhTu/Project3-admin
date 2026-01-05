import {
  IUser,
  UserCreateDTO,
  UserUpdateDTO,
  UserListResponse,
  FilterOptions,
} from "@/types/user.type";
import api from "@/lib/api";

export const userService = {
  // Lấy danh sách users với phân trang và lọc
  async getUsers(filter: FilterOptions = {}): Promise<UserListResponse> {
    try {
      const response = await api.get("/master/users", {
        params: {
          search: filter.search,
          role: filter.role,
          isActive: filter.isActive,
          page: filter.page,
          limit: filter.limit,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        data: [],
        pagination: {
          total: 0,
          page: filter.page ?? 1,
          limit: filter.limit ?? 10,
          totalPages: 0,
        },
      };
    }
  },

  // Lấy user theo ID
  async getUserById(
    id: string
  ): Promise<{ success: boolean; data: IUser; message?: string }> {
    try {
      const response = await api.get(`/master/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  // Tạo user mới
  async createUser(
    data: UserCreateDTO
  ): Promise<{ success: boolean; data: IUser; message?: string }> {
    try {
      const response = await api.post("/master/users", data);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Cập nhật user
  async updateUser(
    id: string,
    data: UserUpdateDTO
  ): Promise<{ success: boolean; data: IUser; message?: string }> {
    try {
      const response = await api.patch(`/master/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Xóa user
  async deleteUser(
    id: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/master/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Đổi mật khẩu
  async changePassword(
    id: string,
    data: { currentPassword: string; newPassword: string }
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.patch(
        `/master/users/${id}/change-password`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },
};

export default userService;
