"use client";

import { StatCard } from "@/components/ui/StatCard";
import api from "@/lib/api";
import { useEffect, useState } from "react";

const BACKEND_LOCAL = "http://localhost:3001"; // đổi theo backend của bạn

interface Stats {
  totalMovies: number;
  publishedMovies: number;
  unpublishedMovies: number;
  totalViews: number;
  averageRating: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/master/stats`);
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Fetch stats error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=" flex items-center justify-center bg-gray-50">
        <div className="text-zinc-600 dark:text-zinc-400">
          Đang tải thống kê...
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className=" bg-gray-50 min-h-screen ">
      {/* Header */}
      <header className="border-b pd-16">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* <h1 className="text-2xl font-semibold">📊 Dashboard Quản Lý Phim</h1> */}
          <p className="text-sm text-zinc-900">Thống kê tổng quan hệ thống</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Tổng phim" value={stats.totalMovies} color="blue" />
          <StatCard
            title="Đã xuất bản"
            value={stats.publishedMovies}
            color="green"
          />
          <StatCard
            title="Chưa xuất bản"
            value={stats.unpublishedMovies}
            color="yellow"
          />
          <StatCard
            title="Tổng lượt xem"
            value={stats.totalViews.toLocaleString()}
            color="purple"
          />
          <StatCard
            title="Đánh giá TB"
            value={stats.averageRating.toFixed(2)}
            color="pink"
          />
        </div>
      </main>
    </div>
  );
}

// interface StatCardProps {
//   title: string;
//   value: number | string;
//   color: "blue" | "green" | "yellow" | "purple" | "pink";
// }

// function StatCard({ title, value, color }: StatCardProps) {
//   const colors: Record<string, string> = {
//     blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
//     green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
//     yellow:
//       "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
//     purple:
//       "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
//     pink: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
//   };

//   return (
//     <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-5">
//       <div className="flex items-center justify-between">
//         <div>
//           <div className={`py-2 text-xl font-medium ${colors[color]}`}>
//             {title}
//           </div>
//           <p className="text-2xl font-semibold mt-1">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
