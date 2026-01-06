"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IMovie,
  MovieCreateDTO,
  MovieUpdateDTO,
  MovieType,
  MovieFlagType,
  IMovieFlagMetadata,
  IMultiLang,
  IGenre,
  IFranchise,
} from "@/types/movie.type";
import movieService from "@/services/movie.service";
const optionalNumber = z.preprocess(
  (val) => (val === "" || val === null || Number.isNaN(val) ? undefined : val),
  z.number().optional()
);

const optionalYear = z.preprocess(
  (val) => (val === "" || val === null || Number.isNaN(val) ? undefined : val),
  z.number()
);
// Schema validation với Zod
const movieFlagMetadataSchema = z.object({
  score: z.number().optional(),
  reason: z.string().optional(),
  priority: z.number().optional(),
});

const movieFlagSchema = z.object({
  metadata: movieFlagMetadataSchema,
  type: z.nativeEnum(MovieFlagType),
  source: z.enum(["admin", "system"]),
  startAt: z.string().min(1, "Thời gian bắt đầu là bắt buộc"),
  endAt: z.string().nullable(),
});

const movieSchema = z.object({
  // Đa ngôn ngữ
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

  // Ngôn ngữ mặc định
  defaultLang: z.string(),

  // Thông tin cơ bản
  franchiseId: z.string().nullable().optional(),
  poster: z.string().optional(),
  thumbnail: z.string().optional(),
  banner: z.string().optional(),
  backdrop: z.string().optional(),
  trailerUrl: z.string().url().optional().or(z.literal("")),

  // Loại phim
  type: z.nativeEnum(MovieType),

  // Series info
  currentEpisode: optionalNumber.optional(),
  totalEpisodes: optionalNumber.optional(),

  // Mối quan hệ
  genres: z.array(z.string()),
  cast: z.array(z.string()),
  director: z.string().optional(),

  // Thông tin bổ sung
  year: optionalYear.optional(),
  country: z.string().optional(),
  isPublished: z.boolean(),

  // Flags
  flags: z.array(movieFlagSchema).optional(),

  // Thống kê (chỉ read-only, không cho phép edit)
  ratingAvg: z.number().optional(),
  views: z.number().optional(),
  dailyViews: z.number().optional(),
  weeklyViews: z.number().optional(),
  likes: z.number().optional(),
  favorites: z.number().optional(),
  shares: z.number().optional(),
  comments: z.number().optional(),
  lastTrendingUpdate: z.string().optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

interface MovieFormProps {
  movie?: IMovie;
  onSubmit: (data: MovieCreateDTO | MovieUpdateDTO) => Promise<void>;
  onCancel: () => void;
}
interface MultiSelectProps {
  name: string;
  options: Array<{ id: string; title: string }>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  loading?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedIds,
  onChange,
  placeholder = "Tìm kiếm...",
  loading = false,
}) => {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectChange = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedIds, id]);
    } else {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  if (loading) {
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <div className="animate-pulse">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-3 max-h-72 overflow-y-auto space-y-2">
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500"
      />

      {filteredOptions.length === 0 ? (
        <div className="text-gray-500 text-sm py-2">Không tìm thấy</div>
      ) : (
        filteredOptions.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(option.id)}
              onChange={(e) => handleSelectChange(option.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm">{option.title}</span>
          </label>
        ))
      )}
    </div>
  );
};

// interface SingleSelectProps {
//   options: Array<{ id: string; title: string }>;
//   selectedId?: string;
//   onChange: (id?: string) => void;
//   loading?: boolean;
// }

interface SingleSelectProps {
  options: Array<{ id: string; title: string }>;
  selectedId?: string | null;
  onChange: (id: string | null) => void;
  loading?: boolean;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  selectedId,
  onChange,
  loading = false,
}) => {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <div className="animate-pulse">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-3 max-h-72 overflow-y-auto space-y-2">
      {/* Search */}
      <input
        type="text"
        placeholder="Tìm franchise..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-2 py-1 text-sm border rounded"
      />

      {filteredOptions.length === 0 ? (
        <div className="text-gray-500 text-sm py-2">Không tìm thấy</div>
      ) : (
        filteredOptions.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              checked={selectedId === option.id}
              onChange={() => onChange(option.id)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm">{option.title}</span>
          </label>
        ))
      )}

      {/* 🔥 BỎ CHỌN THẬT SỰ */}
      {selectedId && (
        <button
          type="button"
          onClick={() => onChange(null)} // ✅ QUAN TRỌNG
          className="mt-2 text-xs text-red-500"
        >
          Bỏ chọn franchise
        </button>
      )}
    </div>
  );
};

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genresOptions, setGenresOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [franchises, setFranchises] = useState<IFranchise[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  const [castOptions, setCastOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [directorOptions, setDirectorOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([
    "vi",
    // "en",
    // "ja",
    // "ko",
    // "zh",
  ]);
  const [newLang, setNewLang] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch genres
        const genresRes = await movieService.getGenres();
        if (genresRes.success) {
          setGenres(genresRes.data);
        }

        // Fetch franchises
        const franchisesRes = await movieService.getFranchises();
        if (franchisesRes.success) {
          setFranchises(franchisesRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchData();
  }, []);

  // Khởi tạo form với tất cả các trường từ movie
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema) as Resolver<MovieFormData>,
    defaultValues: {
      title: { vi: "", en: "" },
      description: { vi: "", en: "" },
      slug: { vi: "", en: "" },
      defaultLang: "vi",
      type: MovieType.MOVIE,
      isPublished: false,
      genres: [],
      cast: [],
      flags: [],
      ...(movie && {
        title: movie.title,
        description: movie.description,
        slug: movie.slug,
        defaultLang: movie.defaultLang,
        franchiseId: movie.franchiseId?._id,
        poster: movie.poster,
        thumbnail: movie.thumbnail,
        banner: movie.banner,
        backdrop: movie.backdrop,
        trailerUrl: movie.trailerUrl,
        type: movie.type,
        currentEpisode: movie.currentEpisode,
        totalEpisodes: movie.totalEpisodes,
        genres: movie.genres.map((g) => g._id),
        cast: movie.cast.map((c) => c._id),
        director: movie.director?._id,
        year: movie.year,
        country: movie.country,
        isPublished: movie.isPublished,
        flags: movie.flags,
        ratingAvg: movie.ratingAvg,
        views: movie.views,
        dailyViews: movie.dailyViews,
        weeklyViews: movie.weeklyViews,
        likes: movie.likes,
        favorites: movie.favorites,
        shares: movie.shares,
        comments: movie.comments,
        lastTrendingUpdate: movie.lastTrendingUpdate,
      }),
    },
  });

  // Field array cho flags
  const {
    fields: flagFields,
    append: appendFlag,
    remove: removeFlag,
  } = useFieldArray({
    control,
    name: "flags",
  });

  // Fetch options cho dropdowns
  useEffect(() => {
    // TODO: Fetch genres, cast, directors từ API
    setGenresOptions([
      { id: "1", name: "Action" },
      { id: "2", name: "Drama" },
      { id: "3", name: "Comedy" },
    ]);
    setCastOptions([
      { id: "1", name: "Actor 1" },
      { id: "2", name: "Actor 2" },
    ]);
    setDirectorOptions([
      { id: "1", name: "Director 1" },
      { id: "2", name: "Director 2" },
    ]);
  }, []);

  const handleFormSubmit = async (data: MovieFormData) => {
    setIsSubmitting(true);
    try {
      // Lọc bỏ các trường thống kê không cho phép edit
      const {
        views,
        dailyViews,
        weeklyViews,
        likes,
        favorites,
        shares,
        comments,
        lastTrendingUpdate,
        ...submitData
      } = data;

      const movieData: MovieCreateDTO | MovieUpdateDTO = movie
        ? ({ ...submitData, _id: movie._id } as MovieUpdateDTO)
        : (submitData as MovieCreateDTO);
      await onSubmit(movieData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm để thêm ngôn ngữ mới
  const addNewLanguage = () => {
    if (newLang && !availableLanguages.includes(newLang)) {
      setAvailableLanguages([...availableLanguages, newLang]);
      setNewLang("");
    }
  };

  // Hàm để xóa ngôn ngữ
  const removeLanguage = (lang: string) => {
    if (availableLanguages.length > 1 && lang !== watch("defaultLang")) {
      const newLangs = availableLanguages.filter((l) => l !== lang);
      setAvailableLanguages(newLangs);

      // Xóa data của ngôn ngữ đó
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

  // Hàm thêm flag mới
  const addNewFlag = () => {
    appendFlag({
      metadata: { score: 0, priority: 1 },
      type: MovieFlagType.BANNER,
      source: "admin",
      startAt: new Date().toISOString(),
      endAt: null,
    });
  };
  const getFranchiseDisplayName = (franchise: IFranchise) => {
    const defaultLang = getValues("defaultLang") || "vi";
    return (
      franchise.title?.[defaultLang] ||
      franchise.title?.vi ||
      franchise.title?.en ||
      franchise._id
    );
  };
  const getGenreDisplayName = (genre: IGenre) => {
    const defaultLang = getValues("defaultLang") || "vi";
    return (
      genre.title?.[defaultLang] ||
      genre.title?.vi ||
      genre.title?.en ||
      genre._id
    );
  };
  const watchedValues = watch();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Phần quản lý ngôn ngữ */}
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

        {/* Ngôn ngữ mặc định */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngôn ngữ mặc định
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
        </div>

        {/* Hiển thị các trường đa ngôn ngữ cho từng ngôn ngữ */}
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

      {/* Thông tin cơ bản */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loại phim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại phim *
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={MovieType.MOVIE}>Phim lẻ</option>
                  <option value={MovieType.SERIES}>Series</option>
                  <option value={MovieType.EPISODE}>Tập phim</option>
                </select>
              )}
            />
          </div>

          {/* Franchise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Franchise
            </label>
            {/* <input
              type="text"
              {...register("franchiseId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ID của franchise"
            /> */}
            <Controller
              name="franchiseId"
              control={control}
              render={({ field }) => (
                <SingleSelect
                  options={franchises.map((franchise) => ({
                    id: franchise._id,
                    title: getFranchiseDisplayName(franchise),
                  }))}
                  selectedId={field.value ?? null}
                  onChange={field.onChange}
                  loading={loadingGenres}
                />
              )}
            />
            {watchedValues.franchiseId && (
              <p className="text-sm text-gray-600 mt-2">
                Đã chọn:{" "}
                {franchises.find((f) => f._id === watchedValues.franchiseId)
                  ?.title?.[watch("defaultLang")] || "—"}
              </p>
            )}
          </div>
        </div>

        {/* URL hình ảnh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {["poster", "thumbnail", "banner", "backdrop"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field} URL
              </label>
              <input
                type="text"
                {...register(field as keyof MovieFormData)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Trailer URL */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trailer URL
          </label>
          <input
            type="text"
            {...register("trailerUrl")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>

      {/* Số tập (cho series) */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Thông tin tập phim</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tập hiện tại
            </label>
            <input
              type="number"
              {...register("currentEpisode", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tổng số tập
            </label>
            <input
              type="number"
              {...register("totalEpisodes", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Thông tin bổ sung */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Thông tin bổ sung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Năm sản xuất
            </label>
            <input
              type="number"
              {...register("year", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              max="2100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RatingAvg
            </label>
            <input
              type="number"
              step="any"
              {...register("ratingAvg", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quốc gia
            </label>
            <input
              type="text"
              {...register("country")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
        </div>
      </div>

      {/* Mối quan hệ */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Mối quan hệ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Thể loại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Thể loại
            </label>
            <Controller
              name="genres"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  name="genres"
                  options={genres.map((genre) => ({
                    id: genre._id,
                    title: getGenreDisplayName(genre),
                  }))}
                  selectedIds={field.value}
                  onChange={field.onChange}
                  loading={loadingGenres}
                />
              )}
            />
            <div className="mt-2">
              <p className="text-xs text-gray-500 mt-1">
                Chọn thể loại bằng cách nhấp vào checkbox
              </p>
            </div>
          </div>

          {/* Diễn viên */}
        </div>
      </div>

      {/* Flags */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Flags</h3>
          <button
            type="button"
            onClick={addNewFlag}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Thêm Flag
          </button>
        </div>

        {flagFields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Flag {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeFlag(index)}
                className="text-red-600 hover:text-red-800"
              >
                Xóa
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại Flag
                </label>
                <Controller
                  name={`flags.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {Object.values(MovieFlagType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nguồn
                </label>
                <Controller
                  name={`flags.${index}.source`}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="admin">Admin</option>
                      <option value="system">System</option>
                    </select>
                  )}
                />
              </div>

              {/* Metadata */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score
                </label>
                <Controller
                  name={`flags.${index}.metadata.score`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Controller
                  name={`flags.${index}.metadata.priority`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                />
              </div>

              {/* Reason */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do
                </label>
                <Controller
                  name={`flags.${index}.metadata.reason`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                />
              </div>

              {/* Thời gian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bắt đầu
                </label>
                <Controller
                  name={`flags.${index}.startAt`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="datetime-local"
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kết thúc
                </label>
                <Controller
                  name={`flags.${index}.endAt`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="datetime-local"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trạng thái */}
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

      {/* Hiển thị các trường thống kê (read-only) nếu đang edit */}
      {movie && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Thống kê (Read-only)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Views
              </label>
              <input
                type="text"
                value={movie.views}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Likes
              </label>
              <input
                type="text"
                value={movie.likes}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Favorites
              </label>
              <input
                type="text"
                value={movie.favorites}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Nút hành động */}
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
          {isSubmitting ? "Đang xử lý..." : movie ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
