"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { IUser, FilterOptions } from "@/types/user.type";
import { userService } from "@/services/user.service";

interface UserListProps {
  initialUsers?: IUser[];
}

const UserList: React.FC<UserListProps> = ({ initialUsers = [] }) => {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Available roles (có thể lấy từ API hoặc định nghĩa trước)
  const availableRoles = [
    { value: "", label: "Tất cả vai trò" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "moderator", label: "Moderator" },
  ];

  // Fetch data
  useEffect(() => {
    fetchUsers();
  }, [filters.page, filters.role, filters.isActive]);

  // Search effect
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  // Role filter effect
  useEffect(() => {
    setFilters((prev) => ({ ...prev, role: roleFilter || undefined, page: 1 }));
  }, [roleFilter]);
  useEffect(() => {
    fetchUsers();
  }, [filters]);
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch?.trim() || undefined,
      page: 1,
    }));
  }, [debouncedSearch]);

  // Status filter effect
  useEffect(() => {
    let isActive: boolean | undefined;
    if (statusFilter === "active") isActive = true;
    else if (statusFilter === "inactive") isActive = false;
    else isActive = undefined;

    setFilters((prev) => ({ ...prev, isActive, page: 1 }));
  }, [statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(filters);
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await userService.deleteUser(id);
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Xóa người dùng thất bại");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Người dùng
          </h1>
          <p className="text-gray-600">
            Tổng số người dùng: {pagination.total} | Trang {pagination.page}/
            {pagination.totalPages || 1}
          </p>
        </div>
        <Link
          href="/users/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Thêm người dùng
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Email, tên người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border placeholder:text-gray-500  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Vô hiệu hóa</option>
            </select>
          </div>

          {/* Limit per page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng / trang
            </label>
            <select
              value={filters.limit}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value),
                  page: 1,
                }))
              }
              className="w-full px-3 text-gray-500 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Reset Filters */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              setFilters({ page: 1, limit: 20 });
              setSearchTerm("");
              setRoleFilter("");
              setStatusFilter("");
            }}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray- text-black"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avatar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={
                          user.avatar ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                        }
                        alt={user.email}
                        className="h-10 w-10 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.email}
                        </div>
                        {user.username && (
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                        )}
                        {user.firstName && user.lastName && (
                          <div className="text-sm text-gray-500">
                            {user.firstName} {user.lastName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                          user.isActive ?? true
                        )}`}
                      >
                        {user.isActive ? "Hoạt động" : "Vô hiệu"}
                      </span>
                      {user.isVerified && (
                        <div className="mt-1 text-xs text-green-600">
                          ✓ Đã xác thực
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/users/${user._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Xem
                      </Link>
                      <Link
                        href={`/users/edit/${user._id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy người dùng nào
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Trước
              </button>

              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 border rounded ${
                      pagination.page === pageNum
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau →
              </button>

              <div className="text-sm text-gray-600 ml-4">
                Hiển thị {users.length} trên {pagination.total} người dùng
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
