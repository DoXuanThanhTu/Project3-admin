"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import EpisodeForm from "@/components/episodes/EpisodeForm";
import {
  IEpisode,
  EpisodeCreateDTO,
  EpisodeUpdateDTO,
} from "@/types/episode.type";
import { episodeService } from "@/services/episode.service";

export default function EditEpisodePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [episode, setEpisode] = useState<IEpisode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEpisode();
  }, [id]);

  const fetchEpisode = async () => {
    if (!id) return;

    try {
      const response = await episodeService.getEpisodeById(id);
      if (response.success) {
        setEpisode(response.data);
      } else {
        throw new Error("Không tìm thấy tập phim");
      }
    } catch (error) {
      console.error("Error fetching episode:", error);
      alert("Không tìm thấy tập phim");
      router.push("/episodes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: EpisodeCreateDTO | EpisodeUpdateDTO) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const response = await episodeService.updateEpisode(
        id,
        data as EpisodeUpdateDTO
      );
      if (response.success) {
        router.push("/episodes");
        router.refresh();
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Update episode error:", error);
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

  if (!episode) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600">
            Không tìm thấy tập phim
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
              Chỉnh sửa tập phim
            </h1>
            <p className="text-gray-600 mt-1">ID: {episode._id}</p>
          </div>

          <EpisodeForm
            episode={episode}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
