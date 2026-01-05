"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IFranchise,
  FranchiseCreateDTO,
  FranchiseUpdateDTO,
  IMultiLang,
} from "@/types/franchise.type";
import { franchiseService } from "@/services/franchise.service";
import MultiSelect from "../common/MultiSelect";
import { IMovie } from "@/types/movie.type";

// Schema validation
const franchiseSchema = z.object({
  title: z
    .record(z.string(), z.string())
    .refine((val) => Object.keys(val).length > 0, {
      message: "Ít nhất phải có một ngôn ngữ cho tiêu đề",
      path: ["title"],
    }),
  description: z.record(z.string(), z.string()).optional(),
  slug: z
    .record(z.string(), z.string())
    .refine((val) => Object.keys(val).length > 0, {
      message: "Ít nhất phải có một ngôn ngữ cho slug",
      path: ["slug"],
    }),
  movies: z.array(z.string()).optional(),
  isPublished: z.boolean(),
});

type FranchiseFormData = z.infer<typeof franchiseSchema>;

interface FranchiseFormProps {
  franchise?: IFranchise;
  onSubmit: (data: FranchiseCreateDTO | FranchiseUpdateDTO) => Promise<void>;
  onCancel: () => void;
}

const FranchiseForm: React.FC<FranchiseFormProps> = ({
  franchise,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([
    "vi",
    // "en",
  ]);
  const [newLang, setNewLang] = useState("");
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  // Fetch movies for selection
  useEffect(() => {
    const fetchMovies = async () => {
      setLoadingMovies(true);
      try {
        const response = await franchiseService.getMovies();
        if (response.success) {
          setMovies(response.data);
          console.log("Fetched movies:", response.data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMovies();
  }, []);

  // Initialize form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FranchiseFormData>({
    resolver: zodResolver(franchiseSchema),
    defaultValues: {
      title: { vi: "", en: "" },
      description: { vi: "", en: "" },
      slug: { vi: "", en: "" },
      movies: [],
      isPublished: false,
      ...(franchise && {
        title: franchise.title,
        description: franchise.description,
        slug: franchise.slug,
        movies: franchise.movies.map((m) => m._id),
        isPublished: franchise.isPublished,
      }),
    },
  });
  const watchedTitle = watch("title");

  const handleFormSubmit = async (data: FranchiseFormData) => {
    setIsSubmitting(true);
    try {
      const franchiseData: FranchiseCreateDTO | FranchiseUpdateDTO = franchise
        ? ({ ...data, _id: franchise._id } as FranchiseUpdateDTO)
        : (data as FranchiseCreateDTO);
      await onSubmit(franchiseData);
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
    if (availableLanguages.length > 1) {
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
      alert("Không thể xóa ngôn ngữ cuối cùng");
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
              className="px-3 py-1 border rounded placeholder:text-gray-500"
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

        {/* Multi-language fields for each language */}
        {availableLanguages
          //   .filter((lang) => {
          //     const value = watchedTitle?.[lang];
          //     return value && value.trim() !== "";
          //   })
          .map((lang) => (
            <div key={lang} className="mb-6 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">
                  Ngôn ngữ: {lang.toUpperCase()}
                </h4>
                {availableLanguages.length > 1 && (
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

      {/* Movies Selection */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Chọn phim</h3>

        {/* {loadingMovies ? (
          <div className="text-center py-4">Đang tải danh sách phim...</div>
        ) : (
          <Controller
            name="movies"
            control={control}
            render={({ field }) => (
              <div className="border rounded-md p-3 max-h-72 overflow-y-auto space-y-2">
                {moviesOptions.length === 0 ? (
                  <div className="text-gray-500 text-sm py-2">
                    Không có phim nào
                  </div>
                ) : (
                  moviesOptions.map((movie) => (
                    <label
                      key={movie._id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={field.value?.includes(movie._id)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(field.value || []), movie._id]
                            : field.value?.filter((id) => id !== movie._id);
                          field.onChange(newValue);
                        }}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-sm">
                        {movie.title.vi || movie.title.en || movie._id}
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          />
        )}
        <p className="text-xs text-gray-500 mt-2">
          Chọn các phim thuộc franchise này. Có thể để trống nếu chưa có phim.
        </p> */}
        <Controller
          name="movies"
          control={control}
          render={({ field }) => (
            <MultiSelect
              name="movies"
              options={
                movies?.map((movie) => ({
                  id: movie._id,
                  title: movie.title.vi || movie.title.en || movie._id,
                })) || []
              }
              selectedIds={field.value || []}
              onChange={field.onChange}
              loading={loadingMovies}
            />
          )}
        />
      </div>

      {/* Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            {...register("isPublished")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isPublished"
            className="ml-2 block text-sm text-gray-900"
          >
            Công khai
          </label>
        </div>
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
          {isSubmitting ? "Đang xử lý..." : franchise ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default FranchiseForm;
