"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/users/UserForm";
import { UserCreateDTO, UserUpdateDTO } from "@/types/user.type";
import { userService } from "@/services/user.service";

export default function CreateUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: UserCreateDTO | UserUpdateDTO) => {
    setIsSubmitting(true);
    try {
      const response = await userService.createUser(data as UserCreateDTO);
      if (response.success) {
        router.push("/users");
        router.refresh();
      } else {
        throw new Error(response.message || "Tạo người dùng thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Create user error:", error);
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
            <h1 className="text-2xl font-bold text-gray-900">
              Tạo người dùng mới
            </h1>
            <p className="text-gray-600 mt-1">
              Nhập thông tin để tạo người dùng mới
            </p>
          </div>

          <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
