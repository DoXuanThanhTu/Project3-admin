"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IEpisode,
  EpisodeCreateDTO,
  EpisodeUpdateDTO,
} from "@/types/episode.type";
import { episodeService } from "@/services/episode.service";

// Schema validation
const episodeSchema = z.object({
  movieId: z.string().min(1, "Vui lòng chọn phim"),
  serverId: z.string().min(1, "Vui lòng chọn server"),
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
  defaultLang: z.string().min(1, "Ngôn ngữ mặc định là bắt buộc"),
  episodeOrLabel: z.string().min(1, "Số tập là bắt buộc"),
  videoUrl: z
    .string()
    .url("URL video không hợp lệ")
    .min(1, "URL video là bắt buộc"),
  duration: z.string().optional(),
  thumbnail: z
    .string()
    .url("URL thumbnail không hợp lệ")
    .optional()
    .or(z.literal("")),
  isPublished: z.boolean(),
});

type EpisodeFormData = z.infer<typeof episodeSchema>;

interface EpisodeFormProps {
  episode?: IEpisode;
  onSubmit: (data: EpisodeCreateDTO | EpisodeUpdateDTO) => Promise<void>;
  onCancel: () => void;
}

const EpisodeForm: React.FC<EpisodeFormProps> = ({
  episode,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([
    "vi",
  ]);
  const [newLang, setNewLang] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingServers, setLoadingServers] = useState(false);

  // Fetch movies and servers
  useEffect(() => {
    const fetchData = async () => {
      setLoadingMovies(true);
      setLoadingServers(true);
      try {
        const [moviesRes, serversRes] = await Promise.all([
          episodeService.getMovies(),
          episodeService.getServers(),
        ]);

        if (moviesRes.success) setMovies(moviesRes.data);
        if (serversRes.success) setServers(serversRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingMovies(false);
        setLoadingServers(false);
      }
    };

    fetchData();
  }, []);

  // Initialize form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EpisodeFormData>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      movieId: "",
      serverId: "",
      title: { vi: "" },
      slug: { vi: "" },
      defaultLang: "vi",
      episodeOrLabel: "",
      videoUrl: "",
      duration: "",
      thumbnail: "",
      isPublished: false,
      ...(episode && {
        movieId: episode.movieId._id,
        serverId: episode.serverId._id,
        title: episode.title,
        slug: episode.slug,
        defaultLang: episode.defaultLang,
        episodeOrLabel: episode.episodeOrLabel,
        videoUrl: episode.videoUrl,
        duration: episode.duration || "",
        thumbnail: episode.thumbnail || "",
        isPublished: episode.isPublished,
      }),
    },
  });

  const handleFormSubmit = async (data: EpisodeFormData) => {
    setIsSubmitting(true);
    try {
      const episodeData: EpisodeCreateDTO | EpisodeUpdateDTO = episode
        ? ({ ...data, _id: episode._id } as EpisodeUpdateDTO)
        : (data as EpisodeCreateDTO);
      await onSubmit(episodeData);
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
      const slug = watch("slug");

      if (title[lang]) delete title[lang];
      if (slug[lang]) delete slug[lang];

      setValue("title", title);
      setValue("slug", slug);
    } else {
      alert("Không thể xóa ngôn ngữ mặc định hoặc ngôn ngữ cuối cùng");
    }
  };

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle title change to auto-generate slug
  const handleTitleChange = (lang: string, value: string) => {
    const currentTitle = watch("title");
    const currentSlug = watch("slug");

    setValue(`title.${lang}`, value);

    // Only auto-generate slug for the default language
    if (lang === watch("defaultLang")) {
      const generatedSlug = generateSlug(value);
      setValue(`slug.${lang}`, generatedSlug);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Movie Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phim *
            </label>
            {loadingMovies ? (
              <div className="p-2 border rounded bg-gray-100">Đang tải...</div>
            ) : (
              <Controller
                name="movieId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn phim...</option>
                    {movies.map((movie) => (
                      <option key={movie._id} value={movie._id}>
                        {movie.title?.vi || movie.title?.en || movie._id}
                      </option>
                    ))}
                  </select>
                )}
              />
            )}
            {errors.movieId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.movieId.message}
              </p>
            )}
          </div>

          {/* Server Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Server *
            </label>
            {loadingServers ? (
              <div className="p-2 border rounded bg-gray-100">Đang tải...</div>
            ) : (
              <Controller
                name="serverId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn server...</option>
                    {servers.map((server) => (
                      <option key={server._id} value={server._id}>
                        {server.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            )}
            {errors.serverId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.serverId.message}
              </p>
            )}
          </div>

          {/* Episode Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tập / Label *
            </label>
            <input
              type="text"
              {...register("episodeOrLabel")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: 1, 2, Special, OVA..."
            />
            {errors.episodeOrLabel && (
              <p className="mt-1 text-sm text-red-600">
                {errors.episodeOrLabel.message}
              </p>
            )}
          </div>

          {/* Default Language */}
          <div>
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
        </div>
      </div>

      {/* Language Management */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quản lý ngôn ngữ</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Thêm mã ngôn ngữ mới (vd: en)"
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
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleTitleChange(lang, e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`VD: Tập 1 (${lang})`}
                    />
                  )}
                />
                {errors.title?.[lang] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title[lang]?.message}
                  </p>
                )}
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
                      placeholder={`VD: tap-1 (${lang})`}
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

      {/* Media Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Thông tin media</h3>

        <div className="space-y-4">
          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL *
            </label>
            <input
              type="text"
              {...register("videoUrl")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/video.m3u8"
            />
            {errors.videoUrl && (
              <p className="mt-1 text-sm text-red-600">
                {errors.videoUrl.message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Hỗ trợ định dạng: .m3u8, .mp4, .mkv, etc.
            </p>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <input
              type="text"
              {...register("thumbnail")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/thumbnail.jpg"
            />
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời lượng (giây)
            </label>
            <input
              type="number"
              {...register("duration")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: 1461 (24:21 phút)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Thời lượng tính bằng giây. VD: 1461 = 24 phút 21 giây
            </p>
          </div>
        </div>
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
        <p className="text-sm text-gray-500 mt-1">
          Nếu bật, tập phim sẽ hiển thị trên trang web
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
          {isSubmitting ? "Đang xử lý..." : episode ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default EpisodeForm;
