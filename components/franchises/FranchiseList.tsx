"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IFranchise } from "@/types/franchise.type";
import { franchiseService } from "@/services/franchise.service";

interface FranchiseListProps {
  initialFranchises?: IFranchise[];
}

const FranchiseList: React.FC<FranchiseListProps> = ({
  initialFranchises = [],
}) => {
  const [franchises, setFranchises] = useState<IFranchise[]>(initialFranchises);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFranchises();
  }, []);

  const fetchFranchises = async () => {
    setLoading(true);
    try {
      const response = await franchiseService.getFranchises();
      if (response.success) {
        setFranchises(response.data);
      }
    } catch (error) {
      console.error("Error fetching franchises:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa franchise này?")) {
      try {
        await franchiseService.deleteFranchise(id);
        setFranchises(franchises.filter((franchise) => franchise._id !== id));
      } catch (error) {
        console.error("Error deleting franchise:", error);
        alert("Xóa franchise thất bại");
      }
    }
  };

  const filteredFranchises = franchises.filter(
    (franchise) =>
      franchise.title.vi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchise.title.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchise.description.vi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Franchise
          </h1>
          <p className="text-gray-600">
            Tổng số franchise: {franchises.length}
          </p>
        </div>
        <Link
          href="/franchises/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Thêm franchise mới
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm franchise..."
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
                  Số phim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
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
              {filteredFranchises.map((franchise) => (
                <tr key={franchise._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {franchise.title.vi || franchise.title.en}
                      </div>
                      <div className="text-sm text-gray-500">
                        {franchise.title.en &&
                          franchise.title.en !== franchise.title.vi &&
                          franchise.title.en}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-black">
                      {franchise.description.vi ||
                        franchise.description.en ||
                        "Không có mô tả"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {franchise.movies.length} phim
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(franchise.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        franchise.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {franchise.isPublished ? "Công khai" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/franchises/${franchise._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Xem
                    </Link>
                    <Link
                      href={`/franchises/edit/${franchise._id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(franchise._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredFranchises.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy franchise nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FranchiseList;
