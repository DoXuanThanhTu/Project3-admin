import axios from "axios";
import { IMovie, MovieCreateDTO, MovieUpdateDTO } from "@/types/movie.type";
import api from "@/lib/api";

const movieService = {
  // Lấy danh sách movies
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

  // Lấy movie theo ID
  async getMovieById(id: string) {
    const response = await api.get(`/master/movie/${id}`);
    return response.data;
  },

  // Tạo movie mới
  async createMovie(data: MovieCreateDTO) {
    const response = await api.post(`/movie/admin`, data);
    return response.data;
  },

  // Cập nhật movie
  async updateMovie(id: string, data: MovieUpdateDTO) {
    const response = await api.patch(`/movie/admin/${id}`, data);
    return response.data;
  },

  // Xóa movie
  async deleteMovie(id: string) {
    const response = await api.delete(`/movie/admin/${id}`);
    return response.data;
  },

  // Upload hình ảnh
  // async uploadImage(file: File) {
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   const response = await axios.post(`${API_URL}/upload`, formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  //   return response.data;
  // },
  async getGenres() {
    const response = await api.get(`/genre/admin/all`);
    return response.data;
  },

  async getFranchises() {
    const response = await api.get(`/master/franchises`);
    return response.data;
  },
};

export default movieService;
