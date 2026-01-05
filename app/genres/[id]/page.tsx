"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import GenreDetail from "@/components/genres/GenreDetail";
import { IGenre } from "@/types/genre.type";
import { genreService } from "@/services/genre.service";

export default function GenreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [genre, setGenre] = useState<IGenre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGenre();
    }
  }, [id]);

  const fetchGenre = async () => {
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

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa thể loại này?")) {
      try {
        await genreService.deleteGenre(id);
        router.push("/genres");
        router.refresh();
      } catch (error) {
        console.error("Error deleting genre:", error);
        alert("Xóa thể loại thất bại");
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/genres"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Quay lại danh sách
          </Link>
          <div className="space-x-3">
            <Link
              href={`/genres/edit/${genre._id}`}
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

        <GenreDetail genre={genre} />
      </div>
    </div>
  );
}
