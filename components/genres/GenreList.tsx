"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IGenre } from "@/types/genre.type";
import { genreService } from "@/services/genre.service";

interface GenreListProps {
  initialGenres?: IGenre[];
}

const GenreList: React.FC<GenreListProps> = ({ initialGenres = [] }) => {
  const [genres, setGenres] = useState<IGenre[]>(initialGenres);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await genreService.getGenres();
      if (response.success) {
        setGenres(response.data);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa thể loại này?")) {
      try {
        await genreService.deleteGenre(id);
        setGenres(genres.filter((genre) => genre._id !== id));
      } catch (error) {
        console.error("Error deleting genre:", error);
        alert("Xóa thể loại thất bại");
      }
    }
  };

  const filteredGenres = genres.filter(
    (genre) =>
      genre.title.vi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genre.title.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genre.description.vi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genre.slug.vi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Thể loại</h1>
          <p className="text-gray-600">Tổng số thể loại: {genres.length}</p>
        </div>
        <Link
          href="/genres/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Thêm thể loại mới
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm thể loại..."
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
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngôn ngữ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGenres.map((genre) => (
                <tr key={genre._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {genre.title.vi || genre.title.en}
                      </div>
                      <div className="text-sm text-gray-500">
                        {genre.title.en &&
                          genre.title.en !== genre.title.vi &&
                          genre.title.en}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-black">
                      {genre.description.vi ||
                        genre.description.en ||
                        "Không có mô tả"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-800">
                      {genre.slug.vi || genre.slug.en}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {genre.defaultLang.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        genre.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {genre.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(genre.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/genres/${genre._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Xem
                    </Link>
                    <Link
                      href={`/genres/edit/${genre._id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(genre._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGenres.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy thể loại nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenreList;
