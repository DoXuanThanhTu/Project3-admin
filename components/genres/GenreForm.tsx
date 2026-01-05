"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IGenre, GenreCreateDTO, GenreUpdateDTO } from "@/types/genre.type";

// Schema validation
const genreSchema = z.object({
  title: z
    .record(z.string(), z.string())
    .refine((val) => Object.keys(val).length > 0, {
      message: "Ít nhất phải có một ngôn ngữ cho tiêu đề",
      path: ["title"],
    }),
  slug: z
    .record(z.string(), z.string())
    .refine((val) => Object.keys(val).length > 0, {
      message: "Ít nhất phải có một ngôn ngữ cho slug",
      path: ["slug"],
    }),
  description: z.record(z.string(), z.string()).optional(),
  defaultLang: z.string().min(1, "Ngôn ngữ mặc định là bắt buộc"),
  isActive: z.boolean(),
});

type GenreFormData = z.infer<typeof genreSchema>;

interface GenreFormProps {
  genre?: IGenre;
  onSubmit: (data: GenreCreateDTO | GenreUpdateDTO) => Promise<void>;
  onCancel: () => void;
}

const GenreForm: React.FC<GenreFormProps> = ({ genre, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([
    "vi",
    "en",
  ]);
  const [newLang, setNewLang] = useState("");

  // Initialize form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<GenreFormData>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      title: { vi: "", en: "" },
      slug: { vi: "", en: "" },
      description: { vi: "", en: "" },
      defaultLang: "vi",
      isActive: true,
      ...(genre && {
        title: genre.title,
        slug: genre.slug,
        description: genre.description,
        defaultLang: genre.defaultLang,
        isActive: genre.isActive,
      }),
    },
  });

  const handleFormSubmit = async (data: GenreFormData) => {
    setIsSubmitting(true);
    try {
      const genreData: GenreCreateDTO | GenreUpdateDTO = genre
        ? ({ ...data, _id: genre._id } as GenreUpdateDTO)
        : (data as GenreCreateDTO);
      await onSubmit(genreData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add new language
  const addNewLanguage = () => {
    if (newLang && !availableLanguages.includes(newLang)) {
      setAvailableLanguages([...availableLanguages, newLang]);
      setNewLang("");
    }
  };

  // Remove language
  const removeLanguage = (lang: string) => {
    if (availableLanguages.length > 1 && lang !== watch("defaultLang")) {
      const newLangs = availableLanguages.filter((l) => l !== lang);
      setAvailableLanguages(newLangs);

      // Remove data for that language
      const title = watch("title");
      const description = watch("description");
      const slug = watch("slug");

      if (title[lang]) delete title[lang];
      if (description?.[lang]) delete description[lang];
      if (slug[lang]) delete slug[lang];

      setValue("title", title);
      if (description) setValue("description", description);
      setValue("slug", slug);
    } else {
      alert("Không thể xóa ngôn ngữ mặc định hoặc ngôn ngữ cuối cùng");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Language Management */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quản lý ngôn ngữ</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Thêm mã ngôn ngữ mới (vd: fr, de)"
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              className="px-3 py-1 border rounded"
            />
            <button
              type="button"
              onClick={addNewLanguage}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thêm
            </button>
          </div>
        </div>

        {/* Default Language */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngôn ngữ mặc định *
          </label>
          <Controller
            name="defaultLang"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.defaultLang && (
            <p className="mt-1 text-sm text-red-600">
              {errors.defaultLang.message}
            </p>
          )}
        </div>

        {/* Multi-language fields for each language */}
        {availableLanguages.map((lang) => (
          <div key={lang} className="mb-6 p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-800">
                Ngôn ngữ: {lang.toUpperCase()}
                {lang === watch("defaultLang") && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Mặc định
                  </span>
                )}
              </h4>
              {availableLanguages.length > 1 &&
                lang !== watch("defaultLang") && (
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Xóa ngôn ngữ
                  </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề ({lang}) *
                </label>
                <Controller
                  name={`title.${lang}`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Nhập tiêu đề ${lang}`}
                    />
                  )}
                />
                {errors.title?.[lang] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title[lang]?.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả ({lang})
                </label>
                <Controller
                  name={`description.${lang}`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Nhập mô tả ${lang}`}
                    />
                  )}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug ({lang}) *
                </label>
                <Controller
                  name={`slug.${lang}`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Nhập slug ${lang}`}
                    />
                  )}
                />
                {errors.slug?.[lang] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.slug[lang]?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
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
            Kích hoạt
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Nếu tắt, thể loại này sẽ không hiển thị trên trang web
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
          {isSubmitting ? "Đang xử lý..." : genre ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default GenreForm;
