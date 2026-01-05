"use client";

import { IFranchise } from "@/types/franchise.type";
import Link from "next/link";

interface FranchiseDetailProps {
  franchise: IFranchise;
}

const FranchiseDetail: React.FC<FranchiseDetailProps> = ({ franchise }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {franchise.title.vi || franchise.title.en}
            </h1>
            {franchise.title.en &&
              franchise.title.en !== franchise.title.vi && (
                <h2 className="text-xl text-gray-600 mt-1">
                  {franchise.title.en}
                </h2>
              )}
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                franchise.isPublished
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {franchise.isPublished ? "Công khai" : "Nháp"}
            </span>
            <span className="text-sm text-gray-500">
              Tạo ngày:{" "}
              {new Date(franchise.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <span className="text-sm text-gray-500">
              Cập nhật:{" "}
              {new Date(franchise.updatedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-4">
            {franchise.description.vi && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Mô tả (VI)
                </h3>
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {franchise.description.vi}
                </p>
              </div>
            )}
            {franchise.description.en && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Mô tả (EN)
                </h3>
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {franchise.description.en}
                </p>
              </div>
            )}
          </div>

          {/* Movies List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Danh sách phim ({franchise.movies.length})
            </h3>
            {franchise.movies.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {franchise.movies.map((movie) => (
                  <div
                    key={movie._id}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {movie.title.vi || movie.title.en}
                        </h4>
                        {movie.title.en &&
                          movie.title.en !== movie.title.vi && (
                            <p className="text-sm text-gray-600">
                              {movie.title.en}
                            </p>
                          )}
                      </div>
                      <Link
                        href={`/movies/${movie._id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Xem chi tiết →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Chưa có phim nào trong franchise này
              </p>
            )}
          </div>

          {/* Slug Info */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Slug</h3>
            <div className="space-y-2">
              {franchise.slug.vi && (
                <div>
                  <span className="text-sm text-gray-600">VI: </span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-900">
                    {franchise.slug.vi}
                  </code>
                </div>
              )}
              {franchise.slug.en && (
                <div>
                  <span className="text-sm text-gray-600">EN: </span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {franchise.slug.en}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseDetail;
