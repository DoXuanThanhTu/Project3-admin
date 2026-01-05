"use client";

import { IMovie, MovieType } from "@/types/movie.type";

interface MovieDetailProps {
  movie: IMovie;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie }) => {
  const getTypeLabel = (type: MovieType) => {
    switch (type) {
      case MovieType.MOVIE:
        return "Phim lẻ";
      case MovieType.SERIES:
        return "Series";
      case MovieType.EPISODE:
        return "Tập phim";
      default:
        return type;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Banner */}
      {movie.banner && (
        <div className="h-64 overflow-hidden">
          <img
            src={movie.banner}
            alt={movie.title.vi}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start space-x-6">
          {/* Poster */}
          {movie.poster && (
            <div className="flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title.vi}
                className="w-48 h-72 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Thông tin chính */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {movie.title.vi}
                </h1>
                <h2 className="text-xl text-gray-600 mt-1">{movie.title.en}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  {movie.ratingAvg.toFixed(1)} ⭐
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    movie.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {movie.isPublished ? "Công khai" : "Nháp"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {getTypeLabel(movie.type)}
              </span>
              {movie.year && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {movie.year}
                </span>
              )}
              {movie.country && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {movie.country}
                </span>
              )}
              {movie.type === MovieType.SERIES && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {movie.currentEpisode}/{movie.totalEpisodes || "?"} tập
                </span>
              )}
            </div>

            {/* Mô tả */}
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Mô tả (VI)
                </h3>
                <p className="mt-1 text-gray-700">
                  {movie.description?.vi || "Chưa có mô tả"}
                </p>
              </div>
              {movie.description?.en && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Mô tả (EN)
                  </h3>
                  <p className="mt-1 text-gray-700">{movie.description.en}</p>
                </div>
              )}
            </div>

            {/* Thông tin thống kê */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {movie.views}
                </div>
                <div className="text-sm text-gray-600">Lượt xem</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {movie.likes}
                </div>
                <div className="text-sm text-gray-600">Thích</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {movie.favorites}
                </div>
                <div className="text-sm text-gray-600">Yêu thích</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {movie.comments}
                </div>
                <div className="text-sm text-gray-600">Bình luận</div>
              </div>
            </div>

            {/* Thể loại */}
            {movie.genres.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Thể loại
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre._id}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {genre.title.vi}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Flags */}
        {movie.flags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movie.flags.map((flag, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {flag.type}
                    </span>
                    <span className="text-sm text-gray-500">{flag.source}</span>
                  </div>
                  {flag.metadata.reason && (
                    <p className="mt-2 text-gray-700">{flag.metadata.reason}</p>
                  )}
                  <div className="mt-2 text-sm text-gray-600">
                    {new Date(flag.startAt).toLocaleDateString()} -{" "}
                    {flag.endAt
                      ? new Date(flag.endAt).toLocaleDateString()
                      : "Không xác định"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
