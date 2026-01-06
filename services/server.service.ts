// services/server.service.ts
import api from "@/lib/api";
import { IServer, ServerCreateDTO, ServerUpdateDTO } from "@/types/server.type";

export const serverService = {
  // Lấy danh sách server
  async getServers(): Promise<{
    success: boolean;
    data: IServer[];
    message?: string;
  }> {
    try {
      const response = await api.get(`/master/servers`);
      return response.data;
    } catch (error) {
      console.error("Error fetching servers:", error);
      return {
        success: false,
        data: [],
        message: "Không thể tải danh sách server",
      };
    }
  },

  // Lấy server theo ID
  async getServerById(
    id: string
  ): Promise<{ success: boolean; data: IServer; message?: string }> {
    try {
      const response = await api.get(`/server/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching server:", error);
      throw error;
    }
  },

  // Tạo server mới
  async createServer(
    data: ServerCreateDTO
  ): Promise<{ success: boolean; data: IServer; message?: string }> {
    try {
      const response = await api.post(`/server`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating server:", error);
      throw error;
    }
  },

  // Cập nhật server
  async updateServer(
    id: string,
    data: ServerUpdateDTO
  ): Promise<{ success: boolean; data: IServer; message?: string }> {
    try {
      const response = await api.patch(`/server/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating server:", error);
      throw error;
    }
  },

  // Xóa server
  async deleteServer(
    id: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/server/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting server:", error);
      throw error;
    }
  },
};
