"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import EpisodeForm from "@/components/episodes/EpisodeForm";
import { EpisodeCreateDTO, EpisodeUpdateDTO } from "@/types/episode.type";
import { episodeService } from "@/services/episode.service";

export default function CreateEpisodePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EpisodeCreateDTO | EpisodeUpdateDTO) => {
    setIsSubmitting(true);
    try {
      const response = await episodeService.createEpisode(
        data as EpisodeCreateDTO
      );
      if (response.success) {
        router.push("/episodes");
        router.refresh();
      } else {
        throw new Error(response.message || "Tạo tập thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Create episode error:", error);
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
              Tạo tập phim mới
            </h1>
            <p className="text-gray-600 mt-1">
              Nhập thông tin để tạo tập phim mới
            </p>
          </div>

          <EpisodeForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
