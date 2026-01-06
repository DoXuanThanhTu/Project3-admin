// app/servers/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ServerDetail from "@/components/servers/ServerDetail";
import { IServer } from "@/types/server.type";
import { serverService } from "@/services/server.service";

export default function ServerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [server, setServer] = useState<IServer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchServer();
    }
  }, [id]);

  const fetchServer = async () => {
    try {
      const response = await serverService.getServerById(id);
      if (response.success) {
        setServer(response.data);
      } else {
        throw new Error("Không tìm thấy server");
      }
    } catch (error) {
      console.error("Error fetching server:", error);
      alert("Không tìm thấy server");
      router.push("/servers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa server này?")) {
      try {
        await serverService.deleteServer(id);
        router.push("/servers");
        router.refresh();
      } catch (error) {
        console.error("Error deleting server:", error);
        alert("Xóa server thất bại");
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

  if (!server) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600">
            Không tìm thấy server
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
            href="/servers"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Quay lại danh sách
          </Link>
          <div className="space-x-3">
            <Link
              href={`/servers/edit/${server._id}`}
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

        <ServerDetail server={server} />
      </div>
    </div>
  );
}
