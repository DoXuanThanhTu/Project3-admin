"use client";

import { IUser } from "@/types/user.type";

interface UserDetailProps {
  user: IUser;
}

const UserDetail: React.FC<UserDetailProps> = ({ user }) => {
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
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden text-black">
      {/* Cover Image */}
      {user.cover && (
        <div className="h-48 overflow-hidden">
          <img
            src={user.cover}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
            }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-start space-x-6">
          <img
            src={
              user.avatar ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
            alt={user.email}
            className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.displayName}
                </h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
                {user.username && (
                  <p className="text-gray-500">@{user.username}</p>
                )}
              </div>

              <div className="flex space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                    user.isActive ?? true
                  )}`}
                >
                  {user.isActive ? "Hoạt động" : "Vô hiệu"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Information Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Info */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin tài khoản
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-medium">{user.email}</p>
              </div>
              {/* <div>
                <span className="text-sm text-gray-600">Username:</span>
                <p className="font-medium">{user.username || "Chưa đặt"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">
                  Trạng thái xác thực:
                </span>
                <p
                  className={`font-medium ${
                    user.isVerified ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {user.isVerified ? "✓ Đã xác thực" : "Chưa xác thực"}
                </p>
              </div> */}
            </div>
          </div>

          {/* Personal Info */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin cá nhân
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Họ và tên:</span>
                <p className="font-medium">
                  {user.displayName || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Ngày tạo:</span>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              {user.lastLogin && (
                <div>
                  <span className="text-sm text-gray-600">
                    Lần đăng nhập cuối:
                  </span>
                  <p className="font-medium">
                    {new Date(user.lastLogin).toLocaleString("vi-VN")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin kỹ thuật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">ID:</span>
              <code className="block text-sm font-mono mt-1 break-all">
                {user._id}
              </code>
            </div>
            <div>
              <span className="text-sm text-gray-600">Ngày cập nhật:</span>
              <div className="text-sm mt-1">
                {new Date(user.updatedAt).toLocaleString("vi-VN")}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Phiên bản:</span>
              <div className="text-sm mt-1">__v: {user.__v}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
