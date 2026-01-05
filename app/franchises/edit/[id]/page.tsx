"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FranchiseForm from "@/components/franchises/FranchiseForm";
import {
  IFranchise,
  FranchiseUpdateDTO,
  FranchiseCreateDTO,
} from "@/types/franchise.type";
import { franchiseService } from "@/services/franchise.service";

export default function EditFranchisePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [franchise, setFranchise] = useState<IFranchise | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFranchise();
  }, [id]);

  const fetchFranchise = async () => {
    if (!id) return;

    try {
      const response = await franchiseService.getFranchiseById(id);
      if (response.success) {
        setFranchise(response.data);
      } else {
        throw new Error("Không tìm thấy franchise");
      }
    } catch (error) {
      console.error("Error fetching franchise:", error);
      alert("Không tìm thấy franchise");
      router.push("/franchises");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    data: FranchiseUpdateDTO | FranchiseCreateDTO
  ) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const response = await franchiseService.updateFranchise(
        id,
        data as FranchiseUpdateDTO
      );
      if (response.success) {
        router.push("/franchises");
        router.refresh();
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      alert(error.message || "Đã có lỗi xảy ra");
      console.error("Update franchise error:", error);
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

  if (!franchise) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600">
            Không tìm thấy franchise
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
              Chỉnh sửa franchise
            </h1>
            <p className="text-gray-600 mt-1">ID: {franchise._id}</p>
          </div>

          <FranchiseForm
            franchise={franchise}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
