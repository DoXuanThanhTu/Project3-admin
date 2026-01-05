"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IUser, UserCreateDTO, UserUpdateDTO } from "@/types/user.type";

// Schema validation
const userSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .optional()
    .or(z.literal("")),
  role: z.string().min(1, "Vai trò là bắt buộc"),
  avatar: z
    .string()
    .url("URL avatar không hợp lệ")
    .optional()
    .or(z.literal("")),
  cover: z.string().url("URL cover không hợp lệ").optional().or(z.literal("")),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: IUser;
  onSubmit: (data: UserCreateDTO | UserUpdateDTO) => Promise<void>;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  // Available roles
  const availableRoles = [
    { value: "user", label: "User" },
    { value: "moderator", label: "Moderator" },
    { value: "admin", label: "Admin" },
  ];

  // Initialize form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
      avatar: "",
      cover: "",
      username: "",
      firstName: "",
      lastName: "",
      displayName: "",
      isActive: true,
      ...(user && {
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        cover: user.cover || "",
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        displayName: user.displayName || "",
        isActive: user.isActive ?? true,
      }),
    },
  });

  // Reset password field when switching modes
  useEffect(() => {
    if (!isChangePassword) {
      reset({
        ...watch(),
        password: "",
      });
    }
  }, [isChangePassword, reset, watch]);

  const handleFormSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      // Remove password if empty and not changing password
      const submitData = { ...data };
      if (!isChangePassword && !user) {
        // Creating new user requires password
        if (!submitData.password) {
          alert("Vui lòng nhập mật khẩu khi tạo người dùng mới");
          return;
        }
      } else if (!isChangePassword && user) {
        // Updating without password change
        delete submitData.password;
      }

      const userData: UserCreateDTO | UserUpdateDTO = user
        ? ({ ...submitData, _id: user._id } as UserUpdateDTO)
        : (submitData as UserCreateDTO);

      await onSubmit(userData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate random avatar
  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}`;
  };
  const generateRandomCover = () => {
    const seed = Math.random().toString(36).slice(2);
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${seed}`;
  };

  const handleGenerateAvatar = () => {
    const randomAvatar = generateRandomAvatar();
    const randomCover = generateRandomCover();
    reset({
      ...watch(),
      avatar: randomAvatar,
      cover: randomCover,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò *
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Password */}
          {!user ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu *
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Mật khẩu phải có ít nhất 6 ký tự
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="changePassword"
                  checked={isChangePassword}
                  onChange={(e) => setIsChangePassword(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label
                  htmlFor="changePassword"
                  className="ml-2 text-sm text-gray-700"
                >
                  Đổi mật khẩu
                </label>
              </div>

              {isChangePassword && (
                <div>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mật khẩu mới"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Để trống nếu không muốn thay đổi
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Username */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              {...register("username")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username"
            />
          </div> */}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên hiển thị
            </label>
            <input
              type="text"
              {...register("displayName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nguyễn Văn A"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên
            </label>
            <input
              type="text"
              {...register("firstName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Văn A"
            />
          </div> */}
        </div>
      </div>

      {/* Avatar and Cover */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ảnh đại diện & Cover</h3>
          <button
            type="button"
            onClick={handleGenerateAvatar}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
          >
            Tạo avatar ngẫu nhiên
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              type="text"
              {...register("avatar")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/avatar.jpg"
            />
            {errors.avatar && (
              <p className="mt-1 text-sm text-red-600">
                {errors.avatar.message}
              </p>
            )}
            {watch("avatar") && (
              <div className="mt-2">
                <img
                  src={watch("avatar")}
                  alt="Avatar preview"
                  className="h-20 w-20 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
                  }}
                />
              </div>
            )}
          </div>

          {/* Cover URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover URL
            </label>
            <input
              type="text"
              {...register("cover")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/cover.jpg"
            />
            {errors.cover && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cover.message}
              </p>
            )}
            {watch("cover") && (
              <div className="mt-2">
                <img
                  src={watch("cover")}
                  alt="Cover preview"
                  className="h-20 w-full object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-900"
          >
            Kích hoạt tài khoản
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Nếu tắt, người dùng sẽ không thể đăng nhập
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Đang xử lý..." : user ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
