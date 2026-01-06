// app/servers/create/page.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import ServerForm from "@/components/servers/ServerForm";
import { ServerCreateDTO, ServerUpdateDTO } from "@/types/server.type";
import { serverService } from "@/services/server.service";

export default function CreateServerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ServerUpdateDTO | ServerCreateDTO) => {
    setIsSubmitting(true);
    try {
      const response = await serverService.createServer(
        data as ServerCreateDTO
      );
      if (response.success) {
        router.push("/servers");
        router.refresh();
      } else {
        throw new Error(response.message || "Tạo server thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Create server error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Tạo server mới</h1>
            <p className="text-gray-600 mt-1">
              Nhập thông tin để tạo server mới
            </p>
          </div>

          <ServerForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
