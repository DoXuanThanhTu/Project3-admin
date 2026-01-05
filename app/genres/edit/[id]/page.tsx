"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import GenreForm from "@/components/genres/GenreForm";
import { IGenre, GenreCreateDTO, GenreUpdateDTO } from "@/types/genre.type";
import { genreService } from "@/services/genre.service";

export default function EditGenrePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [genre, setGenre] = useState<IGenre | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGenre();
  }, [id]);

  const fetchGenre = async () => {
    if (!id) return;

    try {
      const response = await genreService.getGenreById(id);
      if (response.success) {
        setGenre(response.data);
      } else {
        throw new Error("Không tìm thấy thể loại");
      }
    } catch (error) {
      console.error("Error fetching genre:", error);
      alert("Không tìm thấy thể loại");
      router.push("/genres");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: GenreCreateDTO | GenreUpdateDTO) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const response = await genreService.updateGenre(
        id,
        data as GenreUpdateDTO
      );
      if (response.success) {
        router.push("/genres");
        router.refresh();
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Update genre error:", error);
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

  if (!genre) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600">
            Không tìm thấy thể loại
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
            <h1 className="text-2xl font-bold text-gray-900">
              Chỉnh sửa thể loại
            </h1>
            <p className="text-gray-600 mt-1">ID: {genre._id}</p>
          </div>

          <GenreForm
            genre={genre}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
