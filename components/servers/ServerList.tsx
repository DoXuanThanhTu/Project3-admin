// components/servers/ServerList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IServer } from "@/types/server.type";
import { serverService } from "@/services/server.service";

interface ServerListProps {
  initialServers?: IServer[];
}

const ServerList: React.FC<ServerListProps> = ({ initialServers = [] }) => {
  const [servers, setServers] = useState<IServer[]>(initialServers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    setLoading(true);
    try {
      const response = await serverService.getServers();
      if (response.success) {
        setServers(response.data);
      }
    } catch (error) {
      console.error("Error fetching servers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa server này?")) {
      try {
        await serverService.deleteServer(id);
        setServers(servers.filter((server) => server._id !== id));
      } catch (error) {
        console.error("Error deleting server:", error);
        alert("Xóa server thất bại");
      }
    }
  };

  const filteredServers = servers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.baseUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Server</h1>
          <p className="text-gray-600">Tổng số server: {servers.length}</p>
        </div>
        <Link
          href="/servers/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Thêm server mới
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm server theo tên hoặc URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border text-gray-900 placeholder:text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  Tên Server
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base URL
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
              {filteredServers.map((server) => (
                <tr key={server._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {server.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-gray-900">
                      {server.baseUrl || "Chưa cấu hình"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        server.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {server.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(server.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/servers/${server._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Xem
                    </Link>
                    <Link
                      href={`/servers/edit/${server._id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(server._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredServers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy server nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServerList;
