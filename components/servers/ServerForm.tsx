// components/servers/ServerForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IServer, ServerCreateDTO, ServerUpdateDTO } from "@/types/server.type";

// Schema validation
const serverSchema = z.object({
  name: z.string().min(1, "Tên server là bắt buộc"),
  baseUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
  isActive: z.boolean(),
});

type ServerFormData = z.infer<typeof serverSchema>;

interface ServerFormProps {
  server?: IServer;
  onSubmit: (data: ServerCreateDTO | ServerUpdateDTO) => Promise<void>;
  onCancel: () => void;
}

const ServerForm: React.FC<ServerFormProps> = ({
  server,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: server?.name || "",
      baseUrl: server?.baseUrl || "",
      isActive: server?.isActive || true,
    },
  });

  const handleFormSubmit = async (data: ServerFormData) => {
    setIsSubmitting(true);
    try {
      const serverData: ServerCreateDTO | ServerUpdateDTO = server
        ? ({ ...data, _id: server._id } as ServerUpdateDTO)
        : (data as ServerCreateDTO);
      await onSubmit(serverData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Server Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên server *
        </label>
        <input
          type="text"
          {...register("name")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.name
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="Nhập tên server (ví dụ: netlify, oPhim)"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Base URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Base URL
        </label>
        <input
          type="url"
          {...register("baseUrl")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.baseUrl
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="https://example.com/api"
        />
        {errors.baseUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.baseUrl.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Để trống nếu server không có public URL
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Server đang hoạt động
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Đang xử lý..." : server ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default ServerForm;
