"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import MovieForm from "@/components/movies/MovieForm";
import { MovieCreateDTO, MovieUpdateDTO } from "@/types/movie.type";
import movieService from "@/services/movie.service";

export default function CreateMoviePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: MovieCreateDTO | MovieUpdateDTO) => {
    setIsSubmitting(true);
    try {
      // Since this is a create page, we can safely cast to MovieCreateDTO
      const response = await movieService.createMovie(data as MovieCreateDTO);
      if (response.success) {
        router.push("/movies");
        router.refresh();
      } else {
        throw new Error(response.message || "Tạo phim thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Create movie error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Tạo phim mới</h1>
            <p className="text-gray-600 mt-1">Nhập thông tin để tạo phim mới</p>
          </div>

          <MovieForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
