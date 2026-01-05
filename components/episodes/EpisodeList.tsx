"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { IEpisode, FilterOptions } from "@/types/episode.type";
import { episodeService } from "@/services/episode.service";

interface EpisodeListProps {
  initialEpisodes?: IEpisode[];
}
const getPaginationPages = (
  current: number,
  total: number
): (number | "...")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1, 2, 3];

  if (current > 5) pages.push("...");

  if (current >= 4 && current <= total - 3) {
    pages.push(current - 1, current, current + 1);
  }

  if (current < total - 4) pages.push("...");

  pages.push(total - 2, total - 1, total);

  return [...new Set(pages)].filter(
    (p) => typeof p !== "number" || (p >= 1 && p <= total)
  );
};

const EpisodeList: React.FC<EpisodeListProps> = ({ initialEpisodes = [] }) => {
  const [episodes, setEpisodes] = useState<IEpisode[]>(initialEpisodes);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  /* ---------------- FILTER ---------------- */
  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    limit: 20,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchEpisodes();
  }, [
    filters.page,
    filters.limit,
    filters.movieId,
    filters.serverId,
    filters.search,
  ]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  /* ---------------- SEARCH DEBOUNCE ---------------- */
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch || undefined,
      page: 1,
    }));
  }, [debouncedSearch]);

  const fetchEpisodes = async () => {
    setLoading(true);
    try {
      const res = await episodeService.getEpisodes(filters);
      if (res.success) {
        setEpisodes(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Fetch episodes error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tập phim này?")) {
      try {
        await episodeService.deleteEpisode(id);
        setEpisodes(episodes.filter((ep) => ep._id !== id));
      } catch (error) {
        console.error("Error deleting episode:", error);
        alert("Xóa tập phim thất bại");
      }
    }
  };
  const fetchFilterOptions = async () => {
    try {
      const [moviesRes, serversRes] = await Promise.all([
        episodeService.getMovies(),
        episodeService.getServers(),
      ]);

      if (moviesRes.success) setMovies(moviesRes.data);
      if (serversRes.success) setServers(serversRes.data);
    } catch (err) {
      console.error("Fetch filters error:", err);
    }
  };

  /* ---------------- HANDLERS ---------------- */
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  };

  const formatDuration = (seconds: string) => {
    const s = parseInt(seconds);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="space-y-6 text-black">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản lý tập phim</h1>
          <p className="text-gray-600">
            Tổng: {pagination.total} | Trang {pagination.page}/
            {pagination.totalPages || 1}
          </p>
        </div>
        <Link
          href="/episodes/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Thêm tập
        </Link>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* SEARCH */}
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên tập / slug / số tập..."
            className="border rounded px-3 py-2"
          />

          {/* MOVIE */}
          <select
            value={filters.movieId || ""}
            onChange={(e) => handleFilterChange("movieId", e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Tất cả phim</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title?.vi || m.title?.en}
              </option>
            ))}
          </select>

          {/* SERVER */}
          <select
            value={filters.serverId || ""}
            onChange={(e) => handleFilterChange("serverId", e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Tất cả server</option>
            {servers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* LIMIT */}
          <select
            value={filters.limit}
            onChange={(e) =>
              handleFilterChange("limit", Number(e.target.value))
            }
            className="border rounded px-3 py-2"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={0}>Tất cả</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div
        className={`bg-white rounded shadow overflow-hidden ${
          loading ? "opacity-60" : ""
        }`}
      >
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Tập</th>
              <th>Phim</th>
              <th>Server</th>
              <th>Thời lượng</th>
              <th>Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((ep) => (
              <tr key={ep._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">
                    {ep.title?.vi || `Tập ${ep.episodeOrLabel}`}
                  </div>
                  <div className="text-xs text-gray-400">{ep.slug?.vi}</div>
                </td>
                <td>{ep.movieId.title.vi}</td>
                <td>{ep.serverId.name}</td>
                <td>{ep.duration ? formatDuration(ep.duration) : "-"}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      ep.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ep.isPublished ? "Công khai" : "Nháp"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/episodes/${ep._id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Xem
                  </Link>
                  <Link
                    href={`/episodes/edit/${ep._id}`}
                    className="text-green-600 hover:text-green-900"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(ep._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {episodes.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            Không có tập phim
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          {/* INFO */}
          <div className="text-sm text-gray-400">
            Hiển thị{" "}
            <span className="text-gray-100 font-medium">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            –{" "}
            <span className="text-gray-100 font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            / {pagination.total}
          </div>

          {/* CONTROLS */}
          <div className="flex items-center space-x-1">
            {/* PREV */}
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded border border-gray-700 
                   hover:bg-gray-700 disabled:opacity-40"
            >
              ←
            </button>

            {getPaginationPages(pagination.page, pagination.totalPages).map(
              (p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsisa-${i}`}
                    className="px-3 py-1 text-gray-500"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-3 py-1 rounded border border-gray-700
              ${
                pagination.page === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-700"
              }`}
                  >
                    {p}
                  </button>
                )
            )}

            {/* NEXT */}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 rounded border border-gray-700 
                   hover:bg-gray-700 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeList;
