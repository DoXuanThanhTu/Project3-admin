// components/servers/ServerDetail.tsx
"use client";

import { IServer } from "@/types/server.type";

interface ServerDetailProps {
  server: IServer;
}

const ServerDetail: React.FC<ServerDetailProps> = ({ server }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{server.name}</h1>
            <p className="text-gray-600 mt-2">ID: {server._id}</p>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                server.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {server.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
            </span>
            <span className="text-sm text-gray-500">
              Tạo ngày: {new Date(server.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <span className="text-sm text-gray-500">
              Cập nhật: {new Date(server.updatedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          {/* Base URL */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Base URL
            </h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <code className="text-sm text-gray-900 break-all">
                {server.baseUrl || "Chưa cấu hình"}
              </code>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Mã server</h4>
              <p className="mt-1 text-gray-900">{server._id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Phiên bản</h4>
              <p className="mt-1 text-gray-900">v{server.__v}</p>
            </div>
          </div>

          {/* Test Connection Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (server.baseUrl) {
                  window.open(server.baseUrl, "_blank");
                }
              }}
              disabled={!server.baseUrl}
              className={`px-4 py-2 rounded-md ${
                server.baseUrl
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {server.baseUrl ? "Kiểm tra kết nối" : "Chưa có URL để kiểm tra"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerDetail;
