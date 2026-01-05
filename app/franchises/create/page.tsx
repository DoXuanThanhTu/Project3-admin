"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import FranchiseForm from "@/components/franchises/FranchiseForm";
import { FranchiseCreateDTO, FranchiseUpdateDTO } from "@/types/franchise.type";
import { franchiseService } from "@/services/franchise.service";

export default function CreateFranchisePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: FranchiseUpdateDTO | FranchiseCreateDTO
  ) => {
    setIsSubmitting(true);
    try {
      const response = await franchiseService.createFranchise(
        data as FranchiseCreateDTO
      );
      if (response.success) {
        router.push("/franchises");
        router.refresh();
      } else {
        throw new Error(response.message || "Tạo franchise thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Create franchise error:", error);
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
              Tạo franchise mới
            </h1>
            <p className="text-gray-600 mt-1">
              Nhập thông tin để tạo franchise mới
            </p>
          </div>

          <FranchiseForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
