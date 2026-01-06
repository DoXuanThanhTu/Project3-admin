// app/servers/edit/[id]/page.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ServerForm from "@/components/servers/ServerForm";
import { IServer, ServerUpdateDTO, ServerCreateDTO } from "@/types/server.type";
import { serverService } from "@/services/server.service";

export default function EditServerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [server, setServer] = useState<IServer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServer();
  }, [id]);

  const fetchServer = async () => {
    if (!id) return;

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

  const handleSubmit = async (data: ServerUpdateDTO | ServerCreateDTO) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const response = await serverService.updateServer(
        id,
        data as ServerUpdateDTO
      );
      if (response.success) {
        router.push("/servers");
        router.refresh();
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Update server error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
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
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Chỉnh sửa server
            </h1>
            <p className="text-gray-600 mt-1">ID: {server._id}</p>
          </div>

          <ServerForm
            server={server}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
