"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import GenreForm from "@/components/genres/GenreForm";
import { GenreCreateDTO, GenreUpdateDTO } from "@/types/genre.type";
import { genreService } from "@/services/genre.service";

export default function CreateGenrePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: GenreCreateDTO | GenreUpdateDTO) => {
    setIsSubmitting(true);
    try {
      const response = await genreService.createGenre(data as GenreCreateDTO);
      if (response.success) {
        router.push("/genres");
        router.refresh();
      } else {
        throw new Error(response.message || "Tạo thể loại thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Create genre error:", error);
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
            <h1 className="text-2xl font-bold text-gray-900">
              Tạo thể loại mới
            </h1>
            <p className="text-gray-600 mt-1">
              Nhập thông tin để tạo thể loại mới
            </p>
          </div>

          <GenreForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
