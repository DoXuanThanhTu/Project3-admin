import {
  IEpisode,
  EpisodeCreateDTO,
  EpisodeUpdateDTO,
  EpisodeListResponse,
  FilterOptions,
} from "@/types/episode.type";
import api from "@/lib/api";

export const episodeService = {
  // Lấy danh sách episodes với phân trang và lọc
  async getMovies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    isPublished?: boolean;
  }) {
    const response = await api.get(`/movie/admin/all`, { params });
    return response.data;
  },

  async getServers() {
    const response = await api.get(`/master/servers`);
    return response.data;
  },

  async getEpisodes(filter: FilterOptions = {}): Promise<EpisodeListResponse> {
    try {
      const response = await api.get("/master/episodes", {
        params: {
          movieId: filter.movieId,
          serverId: filter.serverId,
          search: filter.search,
          page: filter.page,
          limit: filter.limit,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching episodes:", error);
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

  // Lấy episode theo ID
  async getEpisodeById(
    id: string
  ): Promise<{ success: boolean; data: IEpisode; message?: string }> {
    try {
      const response = await api.get(`/master/episodes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching episode:", error);
      throw error;
    }
  },

  // Tạo episode mới
  async createEpisode(
    data: EpisodeCreateDTO
  ): Promise<{ success: boolean; data: IEpisode; message?: string }> {
    try {
      const response = await api.post(`/episode`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating episode:", error);
      throw error;
    }
  },

  // Cập nhật episode
  async updateEpisode(
    id: string,
    data: EpisodeUpdateDTO
  ): Promise<{ success: boolean; data: IEpisode; message?: string }> {
    try {
      const response = await api.patch(`/episode/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating episode:", error);
      throw error;
    }
  },

  // Xóa episode
  async deleteEpisode(
    id: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/episode/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting episode:", error);
      throw error;
    }
  },
};

export default episodeService;
