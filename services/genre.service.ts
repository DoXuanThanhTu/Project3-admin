import api from "@/lib/api";
import { IGenre, GenreCreateDTO, GenreUpdateDTO } from "@/types/genre.type";

export const genreService = {
  // Lấy danh sách genres
  async getGenres(): Promise<{
    success: boolean;
    data: IGenre[];
    message?: string;
  }> {
    try {
      const response = await api.get(`/master/genres`);
      return response.data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      return {
        success: false,
        data: [],
        message: "Không thể tải danh sách thể loại",
      };
    }
  },

  // Lấy genre theo ID
  async getGenreById(
    id: string
  ): Promise<{ success: boolean; data: IGenre; message?: string }> {
    try {
      const response = await api.get(`/master/genres/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching genre:", error);
      throw error;
    }
  },

  // Tạo genre mới
  async createGenre(
    data: GenreCreateDTO
  ): Promise<{ success: boolean; data: IGenre; message?: string }> {
    try {
      const response = await api.post(`/master/genres`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating genre:", error);
      throw error;
    }
  },

  // Cập nhật genre
  async updateGenre(
    id: string,
    data: GenreUpdateDTO
  ): Promise<{ success: boolean; data: IGenre; message?: string }> {
    try {
      const response = await api.put(`/master/genres/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating genre:", error);
      throw error;
    }
  },

  // Xóa genre
  async deleteGenre(
    id: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/master/genres/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting genre:", error);
      throw error;
    }
  },
};
