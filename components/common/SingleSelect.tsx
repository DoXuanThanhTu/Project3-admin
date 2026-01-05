import { useState } from "react";

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
export default SingleSelect;
