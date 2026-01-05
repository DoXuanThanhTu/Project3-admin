/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IFranchise,
  FranchiseCreateDTO,
  FranchiseUpdateDTO,
} from "@/types/franchise.type";

import api from "@/lib/api";

export const franchiseService = {
  // Lấy danh sách franchise
  async getFranchises(): Promise<{
    success: boolean;
    data: IFranchise[];
    message?: string;
  }> {
    try {
      const response = await api.get(`/master/franchises`);
      return response.data;
    } catch (error) {
      console.error("Error fetching franchises:", error);
      return {
        success: false,
        data: [],
        message: "Không thể tải danh sách franchise",
      };
    }
  },

  // Lấy franchise theo ID
  async getFranchiseById(
    id: string
  ): Promise<{ success: boolean; data: IFranchise; message?: string }> {
    try {
      const response = await api.get(`/master/franchises/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching franchise:", error);
      throw error;
    }
  },

  // Tạo franchise mới
  async createFranchise(
    data: FranchiseCreateDTO
  ): Promise<{ success: boolean; data: IFranchise; message?: string }> {
    try {
      const response = await api.post(`/franchise`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating franchise:", error);
      throw error;
    }
  },

  // Cập nhật franchise
  async updateFranchise(
    id: string,
    data: FranchiseUpdateDTO
  ): Promise<{ success: boolean; data: IFranchise; message?: string }> {
    try {
      const response = await api.patch(`/franchise/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating franchise:", error);
      throw error;
    }
  },

  // Xóa franchise
  async deleteFranchise(
    id: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/franchise/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting franchise:", error);
      throw error;
    }
  },

  // Lấy danh sách movies để chọn (nếu cần)
  async getMovies(): Promise<{
    success: boolean;
    data: any[];
    message?: string;
  }> {
    try {
      const response = await api.get(`/master/movies`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return {
        success: false,
        data: [],
        message: "Không thể tải danh sách phim",
      };
    }
  },
};
