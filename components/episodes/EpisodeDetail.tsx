"use client";

import { IEpisode } from "@/types/episode.type";

interface EpisodeDetailProps {
  episode: IEpisode;
}

const EpisodeDetail: React.FC<EpisodeDetailProps> = ({ episode }) => {
  const formatDuration = (seconds: string) => {
    const totalSeconds = parseInt(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} giờ ${minutes} phút ${remainingSeconds} giây`;
    }
    return `${minutes} phút ${remainingSeconds} giây`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        {/* Thumbnail */}
        {episode.thumbnail && (
          <div className="mb-6">
            <img
              src={episode.thumbnail}
              alt={episode.title.vi || `Tập ${episode.episodeOrLabel}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {episode.title.vi || `Tập ${episode.episodeOrLabel}`}
            </h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Tập: {episode.episodeOrLabel}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Ngôn ngữ: {episode.defaultLang.toUpperCase()}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  episode.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {episode.isPublished ? "Công khai" : "Nháp"}
              </span>
            </div>
          </div>

          {/* Movie and Server Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phim</h3>
              <div>
                <p className="font-medium text-gray-800">
                  {episode.movieId.title.vi}
                </p>
                {episode.movieId.title.en && (
                  <p className="text-sm text-gray-800">
                    {episode.movieId.title.en}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ID: {episode.movieId._id}
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Server
              </h3>
              <div>
                <p className="font-medium text-gray-800">
                  {episode.serverId.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ID: {episode.serverId._id}
                </p>
              </div>
            </div>
          </div>

          {/* Slug */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Slug</h3>
            <div className="space-y-2">
              {episode.slug.vi && (
                <div>
                  <span className="text-sm text-gray-600">VI: </span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-800">
                    {episode.slug.vi}
                  </code>
                </div>
              )}
              {episode.slug.en && (
                <div>
                  <span className="text-sm text-gray-600">EN: </span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-800">
                    {episode.slug.en}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Video Information */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thông tin video
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Video URL: </span>
                <a
                  href={episode.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {episode.videoUrl}
                </a>
              </div>
              {episode.duration && (
                <div>
                  <span className="text-sm text-gray-600">Thời lượng: </span>
                  <span>{formatDuration(episode.duration)}</span>
                </div>
              )}
              {episode.thumbnail && (
                <div>
                  <span className="text-sm text-gray-600">Thumbnail: </span>
                  <a
                    href={episode.thumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {episode.thumbnail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Technical Info */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thông tin kỹ thuật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">ID:</span>
                <code className="block text-sm font-mono mt-1 break-all text-gray-800">
                  {episode._id}
                </code>
              </div>
              <div>
                <span className="text-sm text-gray-600">Ngày tạo:</span>
                <div className="text-sm mt-1 text-gray-800">
                  {new Date(episode.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Ngày cập nhật:</span>
                <div className="text-sm mt-1 text-gray-800">
                  {new Date(episode.updatedAt).toLocaleString("vi-VN")}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Phiên bản:</span>
                <div className="text-sm mt-1 text-gray-800">
                  __v: {episode.__v}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetail;
