"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MovieForm from "@/components/movies/MovieForm";
import { IMovie, MovieCreateDTO, MovieUpdateDTO } from "@/types/movie.type";
import movieService from "@/services/movie.service";

export default function EditMoviePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<IMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    if (!id) return;

    try {
      const response = await movieService.getMovieById(id);
      if (response.success) {
        setMovie(response.data);
      } else {
        throw new Error("Không tìm thấy phim");
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
      alert("Không tìm thấy phim");
      router.push("/movies");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: MovieCreateDTO | MovieUpdateDTO) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const response = await movieService.updateMovie(
        id,
        data as MovieUpdateDTO
      );
      if (response.success) {
        router.push("/movies");
        router.refresh();
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Update movie error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600">
            Không tìm thấy phim
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa phim</h1>
            <p className="text-gray-600 mt-1">ID: {movie._id}</p>
          </div>

          <MovieForm
            movie={movie}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
