import { useState } from "react";

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

export default MultiSelect;
