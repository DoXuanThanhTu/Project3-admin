"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IMovie, MovieType } from "@/types/movie.type";
import movieService from "@/services/movie.service";

interface MovieListProps {
  initialMovies?: IMovie[];
}

const MovieList: React.FC<MovieListProps> = ({ initialMovies = [] }) => {
  const [movies, setMovies] = useState<IMovie[]>(initialMovies);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await movieService.getMovies();
      if (response.success) {
        setMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phim này?")) {
      try {
        await movieService.deleteMovie(id);
        setMovies(movies.filter((movie) => movie._id !== id));
      } catch (error) {
        console.error("Error deleting movie:", error);
        alert("Xóa phim thất bại");
      }
    }
  };

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.title.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeLabel = (type: MovieType) => {
    switch (type) {
      case MovieType.MOVIE:
        return "Phim lẻ";
      case MovieType.SERIES:
        return "Series";
      case MovieType.EPISODE:
        return "Tập phim";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phim</h1>
          <p className="text-gray-600">Tổng số phim: {movies.length}</p>
        </div>
        <Link
          href="/movies/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Thêm phim mới
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border placeholder:text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thumnail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Năm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovies.map((movie) => (
                <tr key={movie._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {movie.thumbnail ? (
                      <img
                        src={movie.thumbnail}
                        alt={movie.title.vi}
                        className="w-16 h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {movie.title.vi}
                      </div>
                      <div className="text-sm text-gray-500">
                        {movie.title.en}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {getTypeLabel(movie.type)}
                    </span>
                    {movie.type === MovieType.SERIES && (
                      <div className="text-sm text-gray-500 mt-1">
                        {movie.currentEpisode}/{movie.totalEpisodes || "?"} tập
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {movie.year || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        movie.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {movie.isPublished ? "Công khai" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/movies/${movie._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Xem
                    </Link>
                    <Link
                      href={`/movies/edit/${movie._id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(movie._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMovies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy phim nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieList;
