"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MovieDetail from "@/components/movies/MovieDetail";
import { IMovie } from "@/types/movie.type";
import movieService from "@/services/movie.service";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [movie, setMovie] = useState<IMovie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
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

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa phim này?")) {
      try {
        await movieService.deleteMovie(id);
        router.push("/movies");
        router.refresh();
      } catch (error) {
        console.error("Error deleting movie:", error);
        alert("Xóa phim thất bại");
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/movies"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Quay lại danh sách
          </Link>
          <div className="space-x-3">
            <Link
              href={`/movies/edit/${movie._id}`}
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

        <MovieDetail movie={movie} />
      </div>
    </div>
  );
}
