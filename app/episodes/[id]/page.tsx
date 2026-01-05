"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import EpisodeDetail from "@/components/episodes/EpisodeDetail";
import { IEpisode } from "@/types/episode.type";
import { episodeService } from "@/services/episode.service";

export default function EpisodeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [episode, setEpisode] = useState<IEpisode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEpisode();
    }
  }, [id]);

  const fetchEpisode = async () => {
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

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa tập phim này?")) {
      try {
        await episodeService.deleteEpisode(id);
        router.push("/episodes");
        router.refresh();
      } catch (error) {
        console.error("Error deleting episode:", error);
        alert("Xóa tập phim thất bại");
      }
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/episodes"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Quay lại danh sách
          </Link>
          <div className="space-x-3">
            <Link
              href={`/episodes/edit/${episode._id}`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Chỉnh sửa
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>

        <EpisodeDetail episode={episode} />
      </div>
    </div>
  );
}
