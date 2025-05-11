// components/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  icon = "🔍",
  className = "",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border border-gray-300 px-4 py-2 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
};

export { SearchBar };
