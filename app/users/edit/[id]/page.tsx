"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import UserForm from "@/components/users/UserForm";
import { IUser, UserCreateDTO, UserUpdateDTO } from "@/types/user.type";
import { userService } from "@/services/user.service";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    if (!id) return;

    try {
      const response = await userService.getUserById(id);
      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error("Không tìm thấy người dùng");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("Không tìm thấy người dùng");
      router.push("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UserCreateDTO | UserUpdateDTO) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const response = await userService.updateUser(id, data as UserUpdateDTO);
      if (response.success) {
        router.push("/users");
        router.refresh();
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Update user error:", error);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600">
            Không tìm thấy người dùng
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
              Chỉnh sửa người dùng
            </h1>
            <p className="text-gray-600 mt-1">ID: {user._id}</p>
          </div>

          <UserForm
            user={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
