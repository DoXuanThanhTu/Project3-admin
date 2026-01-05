/* eslint-disable @typescript-eslint/no-explicit-any */

import { Film, Eye, Star, CheckCircle, XCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  color: "blue" | "green" | "yellow" | "purple" | "pink";
}

export function StatCard({ title, value, color }: StatCardProps) {
  const styles: Record<string, { wrapper: string; icon: string; Icon: any }> = {
    blue: {
      wrapper: "bg-blue-50 dark:bg-blue-950/40",
      icon: "bg-blue-600 text-white",
      Icon: Film,
    },
    green: {
      wrapper: "bg-green-50 dark:bg-green-950/40",
      icon: "bg-green-600 text-white",
      Icon: CheckCircle,
    },
    yellow: {
      wrapper: "bg-yellow-50 dark:bg-yellow-950/40",
      icon: "bg-yellow-500 text-white",
      Icon: XCircle,
    },
    purple: {
      wrapper: "bg-purple-50 dark:bg-purple-950/40",
      icon: "bg-purple-600 text-white",
      Icon: Eye,
    },
    pink: {
      wrapper: "bg-pink-50 dark:bg-pink-950/40",
      icon: "bg-pink-600 text-white",
      Icon: Star,
    },
  };

  const { wrapper, icon, Icon } = styles[color];

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900
      hover:shadow-md transition-all`}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`h-12 w-12 flex items-center justify-center rounded-xl ${icon}`}
        >
          <Icon className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
          <p className="text-2xl font-semibold mt-1 text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
