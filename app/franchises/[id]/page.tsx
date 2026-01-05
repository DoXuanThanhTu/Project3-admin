"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import FranchiseDetail from "@/components/franchises/FranchiseDetail";
import { IFranchise } from "@/types/franchise.type";
import { franchiseService } from "@/services/franchise.service";

export default function FranchiseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [franchise, setFranchise] = useState<IFranchise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchFranchise();
    }
  }, [id]);

  const fetchFranchise = async () => {
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

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa franchise này?")) {
      try {
        await franchiseService.deleteFranchise(id);
        router.push("/franchises");
        router.refresh();
      } catch (error) {
        console.error("Error deleting franchise:", error);
        alert("Xóa franchise thất bại");
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/franchises"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Quay lại danh sách
          </Link>
          <div className="space-x-3">
            <Link
              href={`/franchises/edit/${franchise._id}`}
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

        <FranchiseDetail franchise={franchise} />
      </div>
    </div>
  );
}
