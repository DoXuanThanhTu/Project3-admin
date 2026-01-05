"use client";

import { IGenre } from "@/types/genre.type";

interface GenreDetailProps {
  genre: IGenre;
}

const GenreDetail: React.FC<GenreDetailProps> = ({ genre }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {genre.title.vi || genre.title.en}
            </h1>
            {genre.title.en && genre.title.en !== genre.title.vi && (
              <h2 className="text-xl text-gray-600 mt-1">{genre.title.en}</h2>
            )}
          </div>

          {/* Status and Info */}
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                genre.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {genre.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Ngôn ngữ: {genre.defaultLang.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">
              Tạo ngày: {new Date(genre.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <span className="text-sm text-gray-500">
              Cập nhật: {new Date(genre.updatedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-4">
            {genre.description.vi && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Mô tả (VI)
                </h3>
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {genre.description.vi}
                </p>
              </div>
            )}
            {genre.description.en && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Mô tả (EN)
                </h3>
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {genre.description.en}
                </p>
              </div>
            )}
          </div>

          {/* Slug Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Slug VI
              </h3>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                <code className="text-sm">{genre.slug.vi || "Chưa có"}</code>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Slug EN
              </h3>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                <code className="text-sm">{genre.slug.en || "Chưa có"}</code>
              </div>
            </div>
          </div>

          {/* ID */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thông tin kỹ thuật
            </h3>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">ID:</span>
                  <code className="block text-sm font-mono mt-1 break-all text-gray-800">
                    {genre._id}
                  </code>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phiên bản:</span>
                  <div className="text-sm mt-1">__v: {genre.__v}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreDetail;
